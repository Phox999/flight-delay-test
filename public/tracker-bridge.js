/**
 * 將這支檔案載入到「班機延誤核心流程」裡。
 * 它會把流程內事件傳給外層的研究問卷頁面。
 */
(function(){
  const TYPE="flight-delay-research";
  let activePage=null;
  function emit(event, meta={}, page_id=null, page_name=null){
    if(window.parent===window) return;
    window.parent.postMessage({type:TYPE,event,meta,page_id,page_name},"*");
  }

  function page(page_id,page_name,meta={}){
    const next={page_id:page_id||null,page_name:page_name||page_id||"未知畫面"};
    if(activePage?.page_id===next.page_id&&activePage?.page_name===next.page_name) return;
    activePage=next;
    emit("page_view",meta,next.page_id,next.page_name);
  }

  window.ResearchTracker = {
    emit,
    page,
    back(meta={}){ emit("back",meta); },
    retry(meta={}){ emit("retry",meta); },
    uploadAttempt(meta={}){ emit("upload_attempt",meta); },
    uploadFail(meta={}){ emit("upload_fail",meta); },
    ocrFail(meta={}){ emit("ocr_fail",meta); },
    aiEdit(field,fromValue,toValue){ emit("ai_edit",{field,fromValue,toValue}); },
    recoveryFound(meta={}){ emit("recovery_found",meta); },
    success(meta={}){ emit("task_success",meta); }
  };

  page("afah-home","阿發首頁");

  document.addEventListener("click",event=>{
    const control=event.target.closest("button,a,select,[onclick],[data-chat-action],[role='button'],[role='checkbox'],[role='radio'],[role='tab'],[role='option'],input[type='button'],input[type='submit'],input[type='checkbox'],input[type='radio'],summary");
    if(!control||control.disabled||control.getAttribute("aria-disabled")==="true") return;
    emit("screen_click",{},activePage?.page_id||"afah-home",activePage?.page_name||"阿發首頁");
  },true);

  addEventListener("pagehide",()=>{
    if(activePage) emit("page_exit",{},activePage.page_id,activePage.page_name);
  });

  addEventListener("popstate",()=>emit("back",{source:"popstate"}));
})();
