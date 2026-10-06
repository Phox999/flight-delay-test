/**
 * 將這支檔案載入到「班機延誤核心流程」裡。
 * 它會把流程內事件傳給外層的研究問卷頁面。
 */
(function(){
  const TYPE="flight-delay-research";
  function emit(event, meta={}, page_id=null, page_name=null){
    if(window.parent===window) return;
    window.parent.postMessage({type:TYPE,event,meta,page_id,page_name},"*");
  }

  window.ResearchTracker = {
    emit,
    page(page_id,page_name,meta={}){ emit("page_view",meta,page_id,page_name); },
    back(meta={}){ emit("back",meta); },
    retry(meta={}){ emit("retry",meta); },
    uploadAttempt(meta={}){ emit("upload_attempt",meta); },
    uploadFail(meta={}){ emit("upload_fail",meta); },
    ocrFail(meta={}){ emit("ocr_fail",meta); },
    aiEdit(field,fromValue,toValue){ emit("ai_edit",{field,fromValue,toValue}); },
    recoveryFound(meta={}){ emit("recovery_found",meta); },
    success(meta={}){ emit("task_success",meta); }
  };

  addEventListener("popstate",()=>emit("back",{source:"popstate"}));
})();