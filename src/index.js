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
    `).bind(sid, group, Date.now(), b.age_range, b.gender, b.travel_insurance_count ?? 0, b.travel_claimed ? 1:0, b.any_claimed ? 1:0, b.viewport||"", b.user_agent||"").run();
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
    `).bind(b.difficulty??null,b.uncertainty_text||"",b.recovery_understanding??null,b.progress_confidence??null,mm[1]).run();
    return json({ok:true});
  }

  if (url.pathname === "/api/admin/summary" && m === "GET") {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const rows = (await env.DB.prepare(`
      SELECT s.*,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='retry') retry_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='recovery_found') recovery_found_count
      FROM sessions s
    `).all()).results;
    const durations = rows.filter(r=>r.completed_at && r.started_at).map(r=>r.completed_at-r.started_at).sort((a,b)=>a-b);
    const median = durations.length ? durations[Math.floor(durations.length/2)] : null;
    const completed = rows.filter(r=>r.status==="completed").length;
    const avgRetry = rows.length ? (rows.reduce((a,r)=>a+(r.retry_count||0),0)/rows.length).toFixed(1) : "0.0";
    const bRows = rows.filter(r=>r.group_code==="B");
    const recovery = bRows.length ? Math.round(100*bRows.filter(r=>r.recovery_found_count>0).length/bRows.length) : 0;
    return json({total:rows.length,completion_rate:rows.length?Math.round(100*completed/rows.length):0,median_duration_ms:median,avg_retry:avgRetry,recovery_rate:recovery});
  }

  if (url.pathname === "/api/admin/sessions" && m === "GET") {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const rows = (await env.DB.prepare(`
      SELECT s.*,
        CASE WHEN s.completed_at IS NOT NULL THEN s.completed_at-s.started_at
             WHEN s.abandoned_at IS NOT NULL THEN s.abandoned_at-s.started_at ELSE NULL END duration_ms,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='back') back_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='retry') retry_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='ocr_fail') ocr_fail_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='ai_edit') ai_edit_count,
        (SELECT COUNT(*) FROM events e WHERE e.session_id=s.id AND e.event_name='recovery_found') recovery_found_count,
        (SELECT GROUP_CONCAT(COALESCE(e.page_name,e.page_id),' → ') FROM events e WHERE e.session_id=s.id AND e.event_name='page_view') operation_path
      FROM sessions s ORDER BY s.started_at DESC LIMIT 500
    `).all()).results;
    return json({sessions:rows});
  }

  mm = url.pathname.match(/^\/api\/admin\/session\/([^/]+)$/);
  if (mm && m === "GET") {
    if (!adminOK(request,env)) return json({error:"unauthorized"},401);
    const sid=mm[1];
    const session=await env.DB.prepare(`SELECT * FROM sessions WHERE id=?`).bind(sid).first();
    const events=(await env.DB.prepare(`SELECT * FROM events WHERE session_id=? ORDER BY created_at`).bind(sid).all()).results
      .map(e=>({...e,meta:safeParse(e.meta_json)}));
    const dwell={};
    for(let i=0;i<events.length;i++){
      const e=events[i];
      if(e.event_name!=="page_view") continue;
      const key=e.page_name||e.page_id||"未知頁面";
      const next=events.slice(i+1).find(x=>x.event_name==="page_view"||x.event_name==="task_success"||x.event_name==="task_abandon");
      if(next) dwell[key]=(dwell[key]||0)+Math.max(0,next.created_at-e.created_at);
    }
    return json({session,events,page_dwell_ms:dwell});
  }

  return json({error:"not found"},404);
}
function safeParse(s){ try{return JSON.parse(s||"{}")}catch{return{}} }
