export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/config.js") {
      const flowUrl = new URL(env.FLOW_URL || "/flow/", url.origin).href;
      return new Response(`window.APP_CONFIG=${JSON.stringify({ FLOW_URL: flowUrl })};`, {
        headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (url.pathname.startsWith("/api/")) {
      try { return await handleApi(request, env, url); }
      catch (e) { return json({ error: e.message || String(e) }, 500); }
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status=200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
async function body(request){ try { return await request.json(); } catch { return {}; } }
function adminOK(request, env){ return !!env.ADMIN_KEY && request.headers.get("X-Admin-Key") === env.ADMIN_KEY; }
function id(){ return crypto.randomUUID(); }

async function handleApi(request, env, url) {
  const m = request.method.toUpperCase();

  if (url.pathname === "/api/sessions" && m === "POST") {
    const b = await body(request);
    const sid = id();
    const group = crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0 ? "A" : "B";
    await env.DB.prepare(`
      INSERT INTO sessions
      (id, group_code, started_at, status, age_range, gender, travel_insurance_count, travel_claimed, any_claimed, viewport, user_agent)
      VALUES (?, ?, ?, 'in_progress', ?, ?, ?, ?, ?, ?, ?)
    `).bind(sid, group, Date.now(), b.age_range??null, b.gender??null, b.travel_insurance_count ?? 0, b.travel_claimed ? 1:0, b.any_claimed ? 1:0, b.viewport||"", b.user_agent||"").run();
    return json({ id:sid, group_code:group });
  }

  if (url.pathname === "/api/events" && m === "POST") {
    const b = await body(request);
    if (!b.session_id || !b.event_name) return json({error:"missing session_id/event_name"},400);
    const now = Date.now();
    await env.DB.prepare(`
      INSERT INTO events (session_id,event_name,page_id,page_name,created_at,meta_json)
      VALUES (?,?,?,?,?,?)
    `).bind(b.session_id,b.event_name,b.page_id||null,b.page_name||null,now,JSON.stringify(b.meta||{})).run();

    if (b.event_name === "task_success") {
      await env.DB.prepare(`UPDATE sessions SET status='completed', completed_at=COALESCE(completed_at, ?) WHERE id=?`)
        .bind(now,b.session_id).run();
    }
    if (b.event_name === "task_abandon") {
      const loc = b.page_name || b.page_id || null;
      await env.DB.prepare(`UPDATE sessions SET status='abandoned', abandoned_at=COALESCE(abandoned_at, ?), abandon_location=COALESCE(abandon_location, ?) WHERE id=?`)
        .bind(now,loc,b.session_id).run();
    }
    return json({ok:true});
  }

  let mm = url.pathname.match(/^\/api\/sessions\/([^/]+)\/finish$/);
  if (mm && m === "POST") {
    const b = await body(request), now=Date.now(), sid=mm[1];
    const status = b.status === "completed" ? "completed" : "abandoned";
    await env.DB.prepare(`
      UPDATE sessions SET status=?, completed_at=?, abandoned_at=?, abandon_location=COALESCE(?,abandon_location) WHERE id=?
    `).bind(status, status==="completed"?now:null, status==="abandoned"?now:null, b.abandon_location||null, sid).run();
    return json({ok:true});
  }

  mm = url.pathname.match(/^\/api\/sessions\/([^/]+)\/answers$/);
  if (mm && m === "POST") {
    const b=await body(request);
    await env.DB.prepare(`
      UPDATE sessions SET difficulty=?, uncertainty_text=?, recovery_understanding=?, progress_confidence=? WHERE id=?
    `).bind(b.ease_agreement??b.difficulty??null,b.hesitation_feedback??b.uncertainty_text??"",b.next_step_clarity??b.recovery_understanding??null,b.independent_confidence??b.progress_confidence??null,mm[1]).run();
    await env.DB.prepare(`
      INSERT INTO events (session_id,event_name,created_at,meta_json) VALUES (?, 'post_task_feedback', ?, ?)
    `).bind(mm[1],Date.now(),JSON.stringify({
      ease_agreement:b.ease_agreement??null,
      submission_confidence:b.submission_confidence??null,
      completion_evidence:b.completion_evidence||"",
      failure_cause:b.failure_cause||null,
      failure_cause_other:b.failure_cause_other||"",
      next_step_clarity:b.next_step_clarity??null,
      delay_proof_plan:b.delay_proof_plan||"",
      eligibility_scenarios:Array.isArray(b.eligibility_scenarios)?b.eligibility_scenarios:[],
      independent_confidence:b.independent_confidence??null,
      hesitation_feedback:b.hesitation_feedback||""
    })).run();
    return json({ok:true});
  }

  if (url.pathname === "/api/admin/analytics" && (m === "GET" || m === "POST")) {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const dateRange=parseTaipeiDateRange(url);
    if(dateRange===false) return json({error:"invalid_date_range"},400);
    let sessionIds=null;
    if(m==="POST"){
      const filters=await body(request);
      if(!Array.isArray(filters.session_ids)||filters.session_ids.length>500||filters.session_ids.some(sessionId=>typeof sessionId!=="string"||sessionId.length>128))return json({error:"invalid_session_filter"},400);
      sessionIds=[...new Set(filters.session_ids)];
    }
    return json(await buildAdminAnalytics(env,url,dateRange,sessionIds));
  }

  if (url.pathname === "/api/admin/summary" && m === "GET") {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const rows = (await env.DB.prepare(`
      SELECT s.*,
        ${taskCompletionScreenTimestampSql("s")} task_completion_screen_at,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='retry') retry_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='recovery_found') recovery_found_count
      FROM sessions s
    `).all()).results;
    const completedRows=rows.filter(r=>r.task_completion_screen_at!==null&&r.task_completion_screen_at!==undefined);
    const durations = completedRows.filter(r=>r.started_at).map(r=>r.task_completion_screen_at-r.started_at).sort((a,b)=>a-b);
    const median = durations.length ? durations[Math.floor(durations.length/2)] : null;
    const completed = completedRows.length;
    const avgRetry = rows.length ? (rows.reduce((a,r)=>a+(r.retry_count||0),0)/rows.length).toFixed(1) : "0.0";
    const bRows = rows.filter(r=>r.group_code==="B");
    const recovery = bRows.length ? Math.round(100*bRows.filter(r=>r.recovery_found_count>0).length/bRows.length) : 0;
    return json({total:rows.length,completion_rate:rows.length?Math.round(100*completed/rows.length):0,median_duration_ms:median,avg_retry:avgRetry,recovery_rate:recovery});
  }

  if (url.pathname === "/api/admin/sessions" && m === "GET") {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const dateRange=parseTaipeiDateRange(url);
    if(dateRange===false) return json({error:"invalid_date_range"},400);
    const sessionsSql=`
      SELECT s.*,
        CASE WHEN s.completed_at IS NOT NULL THEN s.completed_at-s.started_at
             WHEN s.abandoned_at IS NOT NULL THEN s.abandoned_at-s.started_at ELSE NULL END duration_ms,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='back') back_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='retry') retry_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='ocr_fail') ocr_fail_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='ai_edit') ai_edit_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='recovery_found') recovery_found_count,
        ${taskCompletionScreenTimestampSql("s")} task_completion_screen_at,
        ${completionLocationSql("s")} completion_location,
        (SELECT GROUP_CONCAT(COALESCE(e.page_name,e.page_id),' → ') FROM events e WHERE e.session_id=s.id AND e.event_name='page_view') operation_path,
        (SELECT e.meta_json FROM events e WHERE e.session_id=s.id AND e.event_name='pre_task_profile' ORDER BY e.created_at DESC LIMIT 1) pre_task_profile_json,
        (SELECT e.meta_json FROM events e WHERE e.session_id=s.id AND e.event_name='post_task_feedback' ORDER BY e.created_at DESC LIMIT 1) post_task_feedback_json
      FROM (
        SELECT sessions.*,
          ROW_NUMBER() OVER (PARTITION BY group_code ORDER BY started_at ASC, rowid ASC) AS group_sequence
        FROM sessions
        ) s ${dateRange?"WHERE s.started_at >= ? AND s.started_at < ?":""} ORDER BY s.started_at DESC LIMIT 500
    `;
    const sessionsQuery=env.DB.prepare(sessionsSql);
    const rows = (await (dateRange?sessionsQuery.bind(dateRange.start,dateRange.end):sessionsQuery).all()).results.map(session=>({
      ...session,
      participant_code:`${session.group_code}${String(session.group_sequence).padStart(3,"0")}`
    }));
    return json({sessions:rows});
  }

  mm = url.pathname.match(/^\/api\/admin\/session\/([^/]+)$/);
  if (mm && m === "GET") {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const sid=mm[1];
    const session=await env.DB.prepare(`SELECT sessions.*,${taskCompletionScreenTimestampSql("sessions")} task_completion_screen_at FROM sessions WHERE id=?`).bind(sid).first();
    const events=(await env.DB.prepare(`SELECT * FROM events WHERE session_id=? ORDER BY created_at,rowid`).bind(sid).all()).results
      .map(e=>({...e,meta:safeParse(e.meta_json)}));
    const dwell={};
    for(let i=0;i<events.length;i++){
      const e=events[i];
      if(e.event_name!=="page_view") continue;
      const key=e.page_name||e.page_id||"未知頁面";
      const next=events.slice(i+1).find(x=>x.event_name==="page_view"||x.event_name==="task_success"||x.event_name==="task_abandon"||x.event_name==="page_exit");
      if(next) dwell[key]=(dwell[key]||0)+Math.max(0,next.created_at-e.created_at);
    }
    return json({session,events,page_dwell_ms:dwell});
  }

  return json({error:"not found"},404);
}
function safeParse(s){ try{return JSON.parse(s||"{}")}catch{return{}} }
function taskCompletionScreenTimestampSql(sessionAlias){return`COALESCE((SELECT MIN(e.created_at) FROM events e WHERE e.session_id=${sessionAlias}.id AND e.event_name='page_view' AND e.page_id='bank-transfer-otp'),(SELECT MIN(e.created_at) FROM events e WHERE e.session_id=${sessionAlias}.id AND e.event_name='screen_click' AND e.page_id='bank-transfer-otp'),(SELECT MIN(e.created_at) FROM events e WHERE e.session_id=${sessionAlias}.id AND e.event_name='otp_verified' AND json_extract(e.meta_json,'$.purpose')='bank_transfer'))`}
function completionLocationSql(sessionAlias){return`(SELECT CASE WHEN json_extract(e.meta_json,'$.source')='participant-button' OR e.page_id='participant-task-page' THEN COALESCE((SELECT COALESCE(NULLIF(p.page_name,''),NULLIF(p.page_id,'')) FROM events p WHERE p.session_id=e.session_id AND p.event_name='page_view' AND p.rowid<e.rowid ORDER BY p.rowid DESC LIMIT 1),NULLIF(e.page_name,''),NULLIF(e.page_id,''),'阿發畫面（未記錄）') ELSE COALESCE(NULLIF(e.page_name,''),NULLIF(e.page_id,''),(SELECT COALESCE(NULLIF(p.page_name,''),NULLIF(p.page_id,'')) FROM events p WHERE p.session_id=e.session_id AND p.event_name='page_view' AND p.rowid<e.rowid ORDER BY p.rowid DESC LIMIT 1)) END FROM events e WHERE e.session_id=${sessionAlias}.id AND e.event_name='task_success' ORDER BY e.created_at DESC,e.rowid DESC LIMIT 1)`}

function parseTaipeiDateRange(url){
  const from=url.searchParams.get("from"),to=url.searchParams.get("to");
  if(from===null&&to===null)return null;
  const parse=value=>{
    const match=/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value||"");
    if(!match)return null;
    const [,yearText,monthText,dayText,hourText,minuteText]=match,[year,month,day]=[yearText,monthText,dayText].map(Number),calendar=new Date(Date.UTC(year,month-1,day));
    if(calendar.getUTCFullYear()!==year||calendar.getUTCMonth()!==month-1||calendar.getUTCDate()!==day)return null;
    const hasTime=hourText!==undefined,hour=hasTime?Number(hourText):0,minute=hasTime?Number(minuteText):0;
    if(hour>23||minute>59)return null;
    return {timestamp:Date.UTC(year,month-1,day,hour-8,minute),hasTime};
  };
  const start=parse(from),end=parse(to);
  if(!start||!end||start.timestamp>end.timestamp)return false;
  return {start:start.timestamp,end:end.timestamp+(end.hasTime?60000:86400000)};
}

async function buildAdminAnalytics(env,url,dateRange=null,sessionIds=null) {
  const requested=url.searchParams.get("days");
  const parsed=requested===null?30:Number(requested);
  const days=Number.isFinite(parsed)&&parsed>=0?Math.min(3650,Math.floor(parsed)):30;
  const cutoff=days?Date.now()-days*86400000:null;
  const sessionConditions=[],sessionParams=[];
  if(dateRange){sessionConditions.push("started_at >= ? AND started_at < ?");sessionParams.push(dateRange.start,dateRange.end)}
  else if(cutoff!==null&&sessionIds===null){sessionConditions.push("started_at >= ?");sessionParams.push(cutoff)}
  if(sessionIds!==null){if(sessionIds.length){sessionConditions.push(`id IN (${sessionIds.map(()=>"?").join(",")})`);sessionParams.push(...sessionIds)}else sessionConditions.push("1=0")}
  const sessionWhere=sessionConditions.length?"WHERE "+sessionConditions.join(" AND "):"";
  const eventConditions=[],eventParams=[];
  if(sessionIds!==null){if(sessionIds.length){eventConditions.push(`session_id IN (${sessionIds.map(()=>"?").join(",")})`);eventParams.push(...sessionIds)}else eventConditions.push("1=0")}
  else if(dateRange){eventConditions.push("created_at >= ? AND created_at < ?");eventParams.push(dateRange.start,dateRange.end)}
  else if(cutoff!==null){eventConditions.push("created_at >= ?");eventParams.push(cutoff)}
  const eventWhere=eventConditions.length?"WHERE "+eventConditions.join(" AND "):"";
  const sessionsSql=`SELECT id,group_code,started_at,completed_at,abandoned_at,status,abandon_location,age_range,gender,travel_insurance_count,viewport,difficulty,recovery_understanding,progress_confidence,${taskCompletionScreenTimestampSql("sessions")} task_completion_screen_at FROM sessions ${sessionWhere} ORDER BY started_at DESC`;
  const eventsSql=`SELECT session_id,event_name,page_id,page_name,created_at,meta_json FROM events ${eventWhere} ORDER BY created_at`;
  const [sessionResult,eventResult]=await Promise.all([
    sessionParams.length?env.DB.prepare(sessionsSql).bind(...sessionParams).all():env.DB.prepare(sessionsSql).all(),
    eventParams.length?env.DB.prepare(eventsSql).bind(...eventParams).all():env.DB.prepare(eventsSql).all()
  ]);
  const sessions=sessionResult.results||[],events=eventResult.results||[];
  const eventStats=new Map(),participantEvents=new Map(),bySession=new Map(),profilesBySession=new Map(),feedbackBySession=new Map(),screenEventsBySession=new Map();
  for(const event of events){
    if(["page_view","screen_click","page_exit","task_success","task_abandon"].includes(event.event_name)){
      if(!screenEventsBySession.has(event.session_id))screenEventsBySession.set(event.session_id,[]);
      screenEventsBySession.get(event.session_id).push(event);
    }
    if(event.event_name==="pre_task_profile"){
      profilesBySession.set(event.session_id,safeParse(event.meta_json));
      continue;
    }
    if(event.event_name==="post_task_feedback")feedbackBySession.set(event.session_id,safeParse(event.meta_json));
    const total=eventStats.get(event.event_name)||0;
    eventStats.set(event.event_name,total+1);
    if(!participantEvents.has(event.event_name))participantEvents.set(event.event_name,new Set());
    participantEvents.get(event.event_name).add(event.session_id);
    if(!bySession.has(event.session_id))bySession.set(event.session_id,{retry:0,ocr_fail:0,ai_edit:0,recovery_found:0,back:0,names:new Set()});
    const stats=bySession.get(event.session_id);
    stats.names.add(event.event_name);
    if(Object.hasOwn(stats,event.event_name))stats[event.event_name]+=1;
  }
  const screenStats=new Map(),screenFor=(event,sessionId)=>{
    const pageId=event.page_id||null,pageName=event.page_name||pageId||"未知畫面",key=pageId||pageName;
    if(!screenStats.has(key))screenStats.set(key,{page_id:pageId,page_name:pageName,visits:0,participants:new Set(),dwell_samples:[],click_count:0,click_participants:new Set()});
    const screen=screenStats.get(key);
    if(!screen.page_name&&pageName)screen.page_name=pageName;
    if(sessionId)screen.participants.add(sessionId);
    return screen;
  };
  const screenBoundaries=new Set(["page_view","page_exit","task_success","task_abandon"]);
  for(const [sessionId,sessionEvents] of screenEventsBySession){
    let nextBoundary=null;
    for(let index=sessionEvents.length-1;index>=0;index--){
      const event=sessionEvents[index];
      if(event.event_name==="screen_click"){
        const screen=screenFor(event,sessionId);
        screen.click_count+=1;
        screen.click_participants.add(sessionId);
      }else if(event.event_name==="page_view"){
        const screen=screenFor(event,sessionId);
        screen.visits+=1;
        if(nextBoundary)screen.dwell_samples.push(Math.max(0,nextBoundary.created_at-event.created_at));
      }
      if(screenBoundaries.has(event.event_name))nextBoundary=event;
    }
  }
  const medianValue=values=>{
    const sorted=values.filter(value=>Number.isFinite(value)).sort((a,b)=>a-b);
    if(!sorted.length)return null;
    const middle=Math.floor(sorted.length/2);
    return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;
  };
  const screenAnalytics=[...screenStats.values()].map(screen=>({
    page_id:screen.page_id,
    page_name:screen.page_name,
    visits:screen.visits,
    participants:screen.participants.size,
    timed_visits:screen.dwell_samples.length,
    median_dwell_ms:medianValue(screen.dwell_samples),
    avg_dwell_ms:screen.dwell_samples.length?screen.dwell_samples.reduce((sum,value)=>sum+value,0)/screen.dwell_samples.length:null,
    click_count:screen.click_count,
    click_participants:screen.click_participants.size,
    avg_clicks_per_participant:screen.participants.size?screen.click_count/screen.participants.size:0
  })).sort((a,b)=>(b.median_dwell_ms??-1)-(a.median_dwell_ms??-1)||b.avg_clicks_per_participant-a.avg_clicks_per_participant);
  const sessionStats=session=>bySession.get(session.id)||{retry:0,ocr_fail:0,ai_edit:0,recovery_found:0,back:0,names:new Set()};
  const completed=sessions.filter(session=>session.task_completion_screen_at!==null&&session.task_completion_screen_at!==undefined);
  const abandoned=sessions.filter(session=>session.status==="abandoned");
  const durations=completed.map(session=>session.started_at?Math.max(0,session.task_completion_screen_at-session.started_at):null).filter(value=>value!==null).sort((a,b)=>a-b);
  const median=durations.length?(durations.length%2?durations[(durations.length-1)/2]:(durations[durations.length/2-1]+durations[durations.length/2])/2):null;
  const retryTotal=sessions.reduce((sum,session)=>sum+sessionStats(session).retry,0);
  const grouped={A:[],B:[]};
  for(const session of sessions)if(grouped[session.group_code])grouped[session.group_code].push(session);
  const averageFeedback=(rows,key)=>{const values=rows.map(row=>feedbackBySession.get(row.id)?.[key]).filter(value=>value!==null&&value!==undefined&&Number.isFinite(Number(value))).map(Number);return{value:values.length?values.reduce((sum,value)=>sum+value,0)/values.length:null,count:values.length}};
  const groups=Object.entries(grouped).filter(([,rows])=>rows.length).map(([group_code,rows])=>{
    const done=rows.filter(session=>session.task_completion_screen_at!==null&&session.task_completion_screen_at!==undefined);
    const groupDurations=done.map(session=>session.started_at?Math.max(0,session.task_completion_screen_at-session.started_at):null).filter(value=>value!==null).sort((a,b)=>a-b);
    const groupMedian=groupDurations.length?(groupDurations.length%2?groupDurations[(groupDurations.length-1)/2]:(groupDurations[groupDurations.length/2-1]+groupDurations[groupDurations.length/2])/2):null;
    const retry=rows.reduce((sum,session)=>sum+sessionStats(session).retry,0);
    const difficulty=averageFeedback(rows,"ease_agreement"),submission=averageFeedback(rows,"submission_confidence"),recovery=averageFeedback(rows,"next_step_clarity"),confidence=averageFeedback(rows,"independent_confidence");
    return{group_code,total:rows.length,completed:done.length,completion_rate:rows.length?Math.round(done.length*100/rows.length):0,median_duration_ms:groupMedian,avg_retry:rows.length?retry/rows.length:0,ocr_fail_users:rows.filter(session=>sessionStats(session).ocr_fail>0).length,recovery_users:rows.filter(session=>sessionStats(session).recovery_found>0).length,avg_difficulty:difficulty.value,difficulty_responses:difficulty.count,avg_submission_confidence:submission.value,submission_confidence_responses:submission.count,avg_recovery_understanding:recovery.value,recovery_responses:recovery.count,avg_progress_confidence:confidence.value,confidence_responses:confidence.count};
  });
  const distribution=(key,labelFor=value=>String(value||"未填"))=>{
    const counts=new Map();
    for(const session of sessions){const label=labelFor(session[key]);counts.set(label,(counts.get(label)||0)+1)}
    return[...counts].map(([label,total])=>({label,total})).sort((a,b)=>b.total-a.total);
  };
  const profileDistribution=(key,allowMultiple=false)=>{
    const counts=new Map();
    for(const profile of profilesBySession.values()){
      const values=allowMultiple?(Array.isArray(profile[key])?profile[key]:[]):[profile[key]];
      for(const value of new Set(values.filter(Boolean)))counts.set(value,(counts.get(value)||0)+1);
    }
    return[...counts].map(([label,total])=>({label,total})).sort((a,b)=>b.total-a.total||a.label.localeCompare(b.label,"zh-TW"));
  };
  const deviceLabel=viewport=>{
    const width=Number.parseInt(String(viewport||"").split("x")[0],10);
    if(!Number.isFinite(width))return"未記錄";
    return width<768?"手機":width<1024?"平板":"桌機";
  };
  const dailyMap=new Map(),formatTaipeiDay=timestamp=>{
    const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(timestamp));
    const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
    return`${values.year}-${values.month}-${values.day}`;
  };
  for(const session of sessions){
    if(session.started_at){const day=formatTaipeiDay(session.started_at);if(!dailyMap.has(day))dailyMap.set(day,{day,started:0,completed:0});dailyMap.get(day).started+=1;}
    if(session.task_completion_screen_at){const day=formatTaipeiDay(session.task_completion_screen_at);if(!dailyMap.has(day))dailyMap.set(day,{day,started:0,completed:0});dailyMap.get(day).completed+=1;}
  }
  const includedSessionIds=new Set(sessions.map(session=>session.id));
  const funnelEvents=events.filter(event=>includedSessionIds.has(event.session_id));
  const participants=(predicate)=>new Set(funnelEvents.filter(predicate).map(event=>event.session_id));
  const taskStarted=new Set(funnelEvents.filter(event=>event.event_name==="task_start").map(event=>event.session_id));
  const taskCompleted=new Set(completed.map(session=>session.id));
  const selfReportedCompleted=participants(event=>event.event_name==="task_success");
  const eventParticipants=(name,predicate=()=>true)=>participants(event=>event.event_name===name&&predicate(safeParse(event.meta_json)));
  const groupCounts=(ids)=>Object.fromEntries(["A","B"].map(code=>[code,sessions.filter(session=>session.group_code===code&&ids.has(session.id)).length]));
  const successIds=new Set(taskCompleted);
  const feedbackIds=new Set([
    ...feedbackBySession.keys(),
    ...sessions.filter(session=>session.difficulty!==null&&session.difficulty!==undefined).map(session=>session.id)
  ]);
  const authIds=eventParticipants("auth_complete");
  for(const id of eventParticipants("signup_complete"))authIds.add(id);
  const funnelSteps=[
    {key:"registered",label:"完成基本資料",ids:new Set(sessions.map(session=>session.id))},
    {key:"task_started",label:"開始理賠任務",ids:taskStarted},
    {key:"auth_completed",label:"完成登入／註冊",ids:authIds},
    {key:"boarding_pass_uploaded",label:"完成登機證上傳",ids:eventParticipants("boarding_pass_upload_completed")},
    {key:"boarding_info_confirmed",label:"確認航班資料",ids:eventParticipants("boarding_info_confirmed")},
    {key:"delay_proof_uploaded",label:"完成延誤證明上傳",ids:eventParticipants("delay_proof_uploaded")},
    {key:"bank_info_submitted",label:"送出匯款資料",ids:eventParticipants("bank_info_submitted")},
    {key:"payment_otp_verified",label:"完成匯款 OTP 驗證",ids:eventParticipants("otp_verified",meta=>meta.purpose==="bank_transfer")},
    {key:"task_completed",label:"到達匯款動態密碼驗證畫面",ids:successIds},
    {key:"task_self_reported",label:"點擊「我已完成」",ids:selfReportedCompleted},
    {key:"feedback_submitted",label:"提交測後回饋",ids:feedbackIds}
  ];
  const branchIds={
    signup_complete:eventParticipants("signup_complete"),
    signup_otp_verified:eventParticipants("otp_verified",meta=>meta.purpose==="member_signup"),
    login_complete:eventParticipants("auth_complete",meta=>String(meta.method||"").startsWith("login")),
    login_otp_verified:eventParticipants("otp_verified",meta=>meta.purpose==="member_login"),
    boarding_pass_upload_attempted:eventParticipants("upload_attempt",meta=>meta.document_type==="boarding-pass"),
    boarding_pass_uploaded:eventParticipants("boarding_pass_upload_completed"),
    boarding_pass_recognized:eventParticipants("boarding_pass_upload_completed",meta=>meta.recognition==="passed"),
    boarding_pass_ocr_failed:eventParticipants("ocr_fail"),
    manual_alternative_used:eventParticipants("recovery_found"),
    delay_proof_upload_attempted:eventParticipants("upload_attempt",meta=>meta.document_type==="delay-proof"),
    delay_proof_uploaded:eventParticipants("delay_proof_uploaded")
  };
  funnelSteps.splice(3,0,{key:"boarding_pass_upload_attempted",label:"嘗試上傳登機證",ids:branchIds.boarding_pass_upload_attempted});
  funnelSteps.splice(6,0,{key:"delay_proof_upload_attempted",label:"嘗試上傳延誤證明",ids:branchIds.delay_proof_upload_attempted});
  const abandonCounts=new Map();
  for(const session of abandoned){const label=session.abandon_location||"未記錄";abandonCounts.set(label,(abandonCounts.get(label)||0)+1)}
  return{
    summary:{total:sessions.length,completed:completed.length,abandoned:abandoned.length,in_progress:sessions.filter(session=>session.status==="in_progress").length,completion_rate:sessions.length?Math.round(completed.length*100/sessions.length):0,median_duration_ms:median,avg_duration_ms:durations.length?durations.reduce((sum,value)=>sum+value,0)/durations.length:null,avg_retry:sessions.length?retryTotal/sessions.length:0,retry_total:retryTotal},
    funnel:{registered:sessions.length,task_started:taskStarted.size,task_completed:taskCompleted.size,feedback_submitted:feedbackIds.size,steps:funnelSteps.map(step=>({key:step.key,label:step.label,total:step.ids.size,groups:groupCounts(step.ids)})),branches:Object.fromEntries(Object.entries(branchIds).map(([key,ids])=>[key,{total:ids.size,groups:groupCounts(ids)}]))},
    daily:[...dailyMap.values()].sort((a,b)=>a.day.localeCompare(b.day)),
    events:[...eventStats].map(([event_name,total])=>({event_name,total,participants:(participantEvents.get(event_name)||new Set()).size})).sort((a,b)=>b.total-a.total),
    screen_analytics:screenAnalytics,
    groups,
    demographics:{age_range:distribution("age_range"),gender:distribution("gender"),device:distribution("viewport",deviceLabel)},
    pre_task_survey:{
      flight_frequency:profileDistribution("flight_frequency"),
      travel_insurance_frequency:profileDistribution("travel_insurance_frequency"),
      boarding_pass_preference:profileDistribution("boarding_pass_preference"),
      paper_boarding_pass_sources:profileDistribution("paper_boarding_pass_sources",true),
      electronic_boarding_pass_sources:profileDistribution("electronic_boarding_pass_sources",true),
      boarding_pass_retention:profileDistribution("boarding_pass_retention"),
      travel_insurance_claim_experience:profileDistribution("travel_insurance_claim_experience"),
      other_insurance_claim_experience:profileDistribution("other_insurance_claim_experience")
    },
    abandon_locations:[...abandonCounts].map(([label,total])=>({label,total})).sort((a,b)=>b.total-a.total)
  };
}
