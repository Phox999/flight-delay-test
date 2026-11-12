// 自動播放：依 window.AUTOPLAY_STEP 指定的步驟，自動操作阿發流程並循環播放。
// 只負責「模擬操作」，不改動 app.js 的任何流程邏輯。
(() => {
  // 測試用：網址加 ?apstep=05 可暫時覆寫步驟，並把每輪的時間與結束狀態記到 sessionStorage.apLog。
  const DEBUG_STEP = new URLSearchParams(window.location.search).get("apstep");
  const STEP = String(DEBUG_STEP || window.AUTOPLAY_STEP || "01");
  const stage = document.getElementById("preview-stage");
  if (!stage) return;
  if (STEP === "01") stage.style.opacity = "";
  const T0 = Date.now();
  function debugLog(event, extra = "") {
    if (!DEBUG_STEP) return;
    try {
      const visible = [...document.querySelectorAll("[role='dialog'], .file-picker-screen")]
        .filter((d) => !d.closest("[hidden]") && d.getBoundingClientRect().width > 0)
        .map((d) => d.id || d.className).join(",");
      const chat = document.querySelector("#chat-screen");
      const last = chat && chat.lastElementChild ? chat.lastElementChild.textContent.slice(0, 60) : "";
      const log = JSON.parse(window.sessionStorage.getItem("apLog") || "[]");
      log.push({ step: STEP, event, ms: Date.now() - T0, visible, last, extra: String(extra) });
      window.sessionStorage.setItem("apLog", JSON.stringify(log.slice(-40)));
    } catch (error) { /* 儲存不可用時略過 */ }
  }

  // rate：播放速度倍率（1 = 原速；fastForward 期間為 0）。realSleep 不受倍率與 setTimeout 加速影響。
  const nativeSetTimeout = window.setTimeout.bind(window);
  const BASE_RATE = 1 / 1.5; // 整體播放速度：1.5 倍速（數字越大越慢）
  let rate = BASE_RATE;
  let fast = false;
  const realSleep = (ms) => new Promise((resolve) => nativeSetTimeout(resolve, ms));

  // ---- 暫停／繼續（由外層頁面以 postMessage 控制）----
  // 暫停時腳本停在下一個等待點，使用者可以自己操作；若暫停期間真的動過畫面（dirty），外層會改成重播。
  let paused = false;
  let pausedAt = 0;
  let pausedTotal = 0;
  let ended = false;
  let dirty = false;
  let resumeWaiters = [];
  const clock = () => Date.now() - pausedTotal - (paused ? Date.now() - pausedAt : 0);
  const notify = (event) => {
    try { window.parent.postMessage({ type: "afa-autoplay", event, step: STEP }, "*"); } catch (error) { /* 無外層頁面時略過 */ }
  };
  async function gate() {
    while (paused && !fast) await new Promise((resolve) => resumeWaiters.push(resolve));
  }
  function setPaused(value) {
    if (ended || paused === value) return;
    paused = value;
    if (paused) {
      pausedAt = Date.now();
    } else {
      pausedTotal += Date.now() - pausedAt;
      const waiters = resumeWaiters;
      resumeWaiters = [];
      waiters.forEach((resolve) => resolve());
    }
    notify(paused ? "paused" : "playing");
  }
  let started = new URLSearchParams(window.location.search).get("apwait") !== "1";
  let startWaiters = [];
  async function startGate() {
    if (started) return;
    notify("ready");
    await new Promise((resolve) => startWaiters.push(resolve));
  }
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "afa-autoplay" || event.source !== window.parent) return;
    if (data.cmd === "start") {
      started = true;
      startWaiters.forEach((resolve) => resolve());
      startWaiters = [];
    }
    if (data.cmd === "pause") setPaused(true);
    if (data.cmd === "play") setPaused(false);
  });
  const markDirty = (event) => {
    if (!event.isTrusted || dirty || !(paused || ended)) return;
    dirty = true;
    document.querySelectorAll(".ap-focus").forEach((node) => node.classList.remove("ap-focus"));
    document.querySelectorAll(".ap-pressed").forEach((node) => node.classList.remove("ap-pressed"));
    hideCursor();
    notify("dirty");
  };
  document.addEventListener("pointerdown", markDirty, true);
  document.addEventListener("keydown", markDirty, true);

  const sleep = async (ms) => {
    await new Promise((resolve) => nativeSetTimeout(resolve, ms * rate));
    await gate();
  };

  // ---- 觸控游標 ----
  const cursor = document.createElement("div");
  cursor.setAttribute("aria-hidden", "true");
  cursor.style.cssText = [
    "position:absolute", "left:0", "top:0", "width:36px", "height:36px", "margin:-18px 0 0 -18px",
    "border-radius:50%", "background:rgba(79,68,195,.30)", "border:2px solid rgba(79,68,195,.85)", "box-shadow:0 0 0 6px rgba(79,68,195,.12)",
    "pointer-events:none", "z-index:99999", "opacity:0",
    "transition:transform var(--ap-move,.55s) cubic-bezier(.4,0,.2,1), opacity .25s ease, width .15s ease, height .15s ease, margin .15s ease",
    "transform:translate(196px,700px)",
  ].join(";");
  stage.appendChild(cursor);

  function stageScale() {
    const rect = stage.getBoundingClientRect();
    return rect.width / stage.offsetWidth || 1;
  }

  function pointOf(el) {
    const scale = stageScale();
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: (r.left + r.width / 2 - s.left) / scale, y: (r.top + r.height / 2 - s.top) / scale };
  }

  async function moveTo(el) {
    if (fast) return;
    const p = pointOf(el);
    cursor.style.opacity = "1";
    cursor.style.transform = `translate(${p.x}px,${p.y}px)`;
    await sleep(650);
  }

  async function press() {
    if (fast) return;
    cursor.style.width = "26px";
    cursor.style.height = "26px";
    cursor.style.margin = "-13px 0 0 -13px";
    await sleep(160);
    cursor.style.width = "36px";
    cursor.style.height = "36px";
    cursor.style.margin = "-18px 0 0 -18px";
    await sleep(120);
  }

  function isVisible(el) {
    if (!el || el.closest("[hidden]")) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function find(target) {
    if (typeof target !== "string") return target;
    if (target.startsWith("text=")) {
      const label = target.slice(5);
      const nodes = [...document.querySelectorAll("button, a, [role='button'], label")];
      return nodes.reverse().find((n) => n.textContent.trim() === label && isVisible(n) && !n.disabled) || null;
    }
    const list = [...document.querySelectorAll(target)];
    return list.reverse().find((n) => isVisible(n)) || null;
  }

  async function waitFor(target, timeout = 15000) {
    const started = clock();
    while (clock() - started < timeout) {
      const el = find(target);
      if (el) return el;
      await sleep(120);
    }
    throw new Error(`autoplay: 找不到 ${target}`);
  }

  // 等畫面上出現某段文字（錯誤訊息、阿發回覆）
  async function waitText(text, timeout = 15000) {
    const started = clock();
    while (clock() - started < timeout) {
      const hit = [...document.querySelectorAll("p, span, li, div, small, strong")].find((node) => node.childElementCount === 0 && node.textContent.includes(text) && isVisible(node));
      if (hit) return hit;
      await sleep(120);
    }
    throw new Error(`autoplay: 找不到文字 ${text}`);
  }

  // 等元素出現且不是 disabled（按鈕常在輸入完成後才啟用）
  async function waitEnabled(target, timeout = 15000) {
    const started = clock();
    while (clock() - started < timeout) {
      const el = find(target);
      if (el && !el.disabled) return el;
      await realSleep(fast ? 8 : 80);
      await gate();
    }
    throw new Error(`autoplay: 找不到 ${target}（或仍為停用狀態）`);
  }

  async function tap(target, { pause = 500 } = {}) {
    const el = await waitEnabled(target);
    if (fast) {
      el.click();
      await realSleep(0);
      return el;
    }
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    await sleep(250);
    await moveTo(el);
    await press();
    await gate();
    el.click();
    await sleep(pause);
    return el;
  }

  async function type(target, text, { perChar = 70 } = {}) {
    const el = await tap(target, { pause: 200 });
    el.focus();
    // 頁面未取得系統焦點時（例如嵌在 Figma 內），focus 事件不一定會觸發；補發一次讓下拉選單能開啟。
    if (!document.hasFocus()) el.dispatchEvent(new FocusEvent("focus"));
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value")?.set;
    let value = "";
    for (const ch of fast ? [text] : text) {
      value += ch;
      if (setter) setter.call(el, value); else el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      if (!fast) await sleep(perChar);
    }
    el.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(250);
  }

  async function scrollChat(to, duration = 1400) {
    const box = document.querySelector("#chat-screen");
    if (!box) return;
    const from = box.scrollTop;
    const end = to === "bottom" ? box.scrollHeight - box.clientHeight : to;
    const started = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const t = Math.min(1, (now - started) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        box.scrollTop = from + (end - from) * eased;
        if (t < 1) window.requestAnimationFrame(tick); else resolve();
      };
      window.requestAnimationFrame(tick);
    });
  }

  function hideCursor() { cursor.style.opacity = "0"; }

  // 步驟的最後一下：游標移到按鈕、按下去就停住（不真的送出）。
  // 畫面停在「按下送出」的那一刻，不會播到下一步的畫面；游標留在按鈕上。
  let keepCursor = false;
  async function settle(el, quiet = 320, max = 2400) {
    let last = "";
    let since = clock();
    const started = clock();
    while (clock() - started < max) {
      const r = el.getBoundingClientRect();
      const key = Math.round(r.top) + ":" + Math.round(r.left) + ":" + Math.round(r.width);
      if (key !== last) { last = key; since = clock(); }
      else if (clock() - since >= quiet) return;
      await realSleep(60);
      await gate();
    }
  }
  async function finalPress(target) {
    const el = await waitEnabled(target);
    el.scrollIntoView({ block: "nearest" }); // 直接捲到位，不依賴平滑捲動
    await settle(el);
    await moveTo(el);
    await press();
    el.classList.add("ap-pressed");
    keepCursor = true;
    await sleep(600);
    await moveTo(el); // 版面若在按下後才變動，游標跟回按鈕上
  }

  // ---- 02 之後各步驟共用的工具 ----
  function setRate(value) {
    rate = value;
    cursor.style.setProperty("--ap-move", `${0.55 * value}s`);
  }

  // 以計時器（非 rAF）捲動任意容器，背景分頁也能跑完。
  async function scrollBox(box, to, duration = 1400) {
    if (!box) return;
    const from = box.scrollTop;
    const end = to === "bottom" ? box.scrollHeight - box.clientHeight : to;
    const total = duration * rate;
    if (fast || total <= 0) { box.scrollTop = end; return; }
    const started = Date.now();
    while (true) {
      const t = Math.min(1, (Date.now() - started) / total);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      box.scrollTop = from + (end - from) * eased;
      if (t >= 1) break;
      await realSleep(16);
    }
  }

  // 等「需捲到底才啟用」的按鈕；平滑捲動若遲遲沒到底，就直接捲到底並補發 scroll 事件。
  async function enabledAfterScroll(target, scroller, forceAfter = 1800) {
    const started = clock();
    let forced = false;
    const force = () => {
      forced = true;
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event("scroll"));
    };
    if (fast) force();
    while (clock() - started < 15000) {
      const el = find(target);
      if (el && !el.disabled) return el;
      if (!forced && clock() - started > forceAfter) force();
      await realSleep(fast ? 8 : 60);
      await gate();
    }
    throw new Error(`autoplay: 找不到 ${target}（捲到底後仍未啟用）`);
  }

  // 快轉：畫面隱藏、游標不動、等待歸零、app 內的 setTimeout 延遲縮短 200 倍，跑完前置步驟後再淡入。
  async function fastForward(prefix) {
    stage.style.transition = "none";
    stage.style.opacity = "0";
    hideCursor();
    const previousRate = rate;
    const original = window.setTimeout;
    const patched = (callback, delay, ...args) => nativeSetTimeout(callback, (Number(delay) || 0) / 200, ...args);
    window.setTimeout = patched;
    fast = true;
    rate = 0;
    try {
      await prefix();
      await realSleep(60);
    } finally {
      fast = false;
      rate = previousRate;
      if (window.setTimeout === patched) window.setTimeout = original;
    }
    debugLog("revealed");
    stage.style.transition = "opacity .35s ease";
    stage.style.opacity = "1";
    await realSleep(450);
    await startGate();
  }

  // 示範用的假資料（非真實個資）
  const SAMPLE = {
    id: "A123456789",
    password: "Afa2468Demo",
    captcha: "04WG",
    birthday: "19900101",
    name: "王小明",
    phone: "0912345678",
    email: "afa.demo@example.com",
    otp: "123123",
    bankQuery: "013",
    bankCode: "013",
    branchQuery: "新竹",
    branchLabel: "新竹分行",
    account: "0001907088923",
  };

  // ---- 流程片段：快轉與播放共用同一份操作 ----
  const FLOW = {
    // 01：點快速選單，出現注意事項與「確認申請」
    async claim() {
      await tap(".suggestion[data-prompt='我想申請班機延誤理賠']", { pause: 300 });
      await waitFor("[data-chat-action='claim-confirm']");
    },

    // 對話捲到最底，讓「確認申請」露出來（僅快轉時使用）
    async claimButtonsInView() {
      await realSleep(80);
      const chat = document.querySelector("#chat-screen");
      chat.scrollTop = chat.scrollHeight;
    },

    // 02：確認申請 → 登入視窗
    async loginOpen() {
      await tap("[data-chat-action='claim-confirm']");
      await waitFor("#login-id");
    },
    // 快轉用：原型以 LOCK_MEMBER_LOGIN_FOR_TEST 鎖住登入（按「登入」一律顯示帳密有誤），
    // 所以不真的點「登入」，改呼叫 app 自己的 finishAuthLogin() 進到登入成功後的畫面。
    async login() {
      await FLOW.loginOpen();
      window.finishAuthLogin();
      await waitFor("#personal-data-copy");
    },

    // 02A：立即註冊 → 基本資料 → 四項聲明 → 動態密碼 → 設定密碼
    async signupOpen() {
      await FLOW.loginOpen();
      await sleep(600);
      await tap("[data-auth-register]");
      await waitFor("#signup-id");
    },
    async signupBasic() {
      const perChar = 45;
      await type("#signup-id", SAMPLE.id, { perChar });
      await type("#signup-birthday", SAMPLE.birthday, { perChar });
      await type("#signup-name", SAMPLE.name, { perChar: 140 });
      await type("#signup-phone", SAMPLE.phone, { perChar });
      await type("#signup-email", SAMPLE.email, { perChar });
      await tap("#auth-primary");
      await waitFor("[data-open-signup-statement='privacy']");
    },
    async signupStatements() {
      const scroller = document.querySelector("#signup-statement-scroll");
      for (const key of ["privacy", "terms", "online-service", "online-insurance"]) {
        await tap(`[data-open-signup-statement='${key}']`, { pause: 350 });
        // 第一項示範點「滑至最底」，其餘三項直接快速捲到底以縮短片長
        if (!fast && key === "privacy") await tap("#signup-statement-scroll-button", { pause: 200 });
        else if (!fast) { hideCursor(); await scrollBox(scroller, "bottom", 700); }
        await enabledAfterScroll("#signup-statement-agree", scroller, 900);
        await tap("#signup-statement-agree", { pause: 350 });
      }
      await tap("#auth-primary");
      await waitFor("#signup-otp-input");
    },
    async signupOtp() {
      await type("#signup-otp-input", SAMPLE.otp, { perChar: 110 });
      await tap("#auth-primary");
      await waitFor("#signup-password");
    },
    async signupPasswordFill() {
      await type("#signup-password", SAMPLE.password, { perChar: 45 });
      await type("#signup-confirm-password", SAMPLE.password, { perChar: 45 });
    },

    // 03：個資告知事項 → 直接點「滑至最底」→ 同意按鈕亮起
    async consent() {
      const copy = document.querySelector("#personal-data-copy");
      await waitFor("#personal-data-copy");
      if (!fast) {
        await sleep(900);
        await tap("#scroll-to-agree", { pause: 300 });
      }
      await enabledAfterScroll("#personal-data-agree", copy);
    },
    async consentAgree() {
      await tap("#personal-data-agree");
      await waitFor("#upload-dropzone");
    },

    // 04 / 06：上傳視窗 → 選擇檔案 → 挑檔；確認上傳另外一步
    async pickFile(sampleFile) {
      await tap("#upload-dropzone");
      await tap("[data-upload-source='files']", { pause: 700 });
      await tap(`.file-picker-row[data-sample-file='${sampleFile}']`, { pause: 800 });
    },
    async confirmUpload() {
      await tap("#upload-confirm", { pause: 300 });
      hideCursor();
    },
    async boardingPass() {
      await FLOW.pickFile("paper-boarding-pass");
      await FLOW.confirmUpload();
      await waitFor("#confirm-info");
    },

    // 05：登機證資訊確認 → 確認資訊（之後由 app 自動分流：匯款資料或延誤證明）
    async boardingInfo({ edit = false } = {}) {
      await waitFor("#confirm-info");
      if (edit) {
        // 辨識結果被修改過時，app 才會要求上傳班機延誤證明（06 的前置狀態）
        const flight = document.querySelector("#boarding-info-form [name='flight']");
        flight.value = "EK-367";
        flight.dispatchEvent(new Event("input", { bubbles: true }));
      }
      await tap("#confirm-info", { pause: 300 });
    },

    // 06：班機延誤證明上傳
    async delayProof() {
      await FLOW.pickFile("proof-sample-pdf");
      await FLOW.confirmUpload();
      await waitFor("#bank-combobox-input");
    },

    // 07：匯款銀行、分行別、匯款帳號
    async bankFill() {
      await waitFor("#bank-combobox-input");
      await sleep(700);
      await type("#bank-combobox-input", SAMPLE.bankQuery, { perChar: 180 });
      await tap(`[data-bank-option][data-value='${SAMPLE.bankCode}']`);
      await type("#branch-combobox-input", SAMPLE.branchQuery, { perChar: 260 });
      await tap(`[data-branch-option][data-label='${SAMPLE.branchLabel}']`);
      await type("#bank-info-form [name='account']", SAMPLE.account, { perChar: 90 });
    },
    async bank() {
      await FLOW.bankFill();
      await tap("#confirm-bank-info");
      await waitFor("#otp-input");
    },

    // 08：輸入動態密碼
    async otpType({ demoError = false } = {}) {
      await waitFor("#otp-input");
      await sleep(1200);
      if (demoError && !fast) {
        // 錯誤情境：密碼打錯 → 顯示錯誤 → 重新輸入
        await type("#otp-input", "000000", { perChar: 180 });
        await tap("#otp-next", { pause: 400 });
        await waitFor("#otp-error");
        await sleep(ERR_HOLD);
      }
      await type("#otp-input", SAMPLE.otp, { perChar: 220 });
      await sleep(400);
    },
    async otpSubmit() {
      await tap("#otp-next", { pause: 300 });
      await waitFor(".feedback-choice[data-rating='smooth']");
    },

    // 09：滿意度回饋
    async feedback() {
      await tap(".feedback-choice[data-rating='stuck']");
      await waitFor(".feedback-reason-option");
      await sleep(1600);
      await tap(".feedback-reason-option");
      await waitFor(".feedback-done-message");
    },
  };

  // 各步驟的前置狀態（快轉用）
  const toClaimButtons = async () => { await FLOW.claim(); await FLOW.claimButtonsInView(); };
  const toLoginDone = async () => { await FLOW.claim(); await FLOW.login(); };
  const toUploadDialog = async () => { await toLoginDone(); await FLOW.consent(); await FLOW.consentAgree(); };
  const toBoardingInfo = async () => { await toUploadDialog(); await FLOW.boardingPass(); };
  const toBankDialog = async () => { await toBoardingInfo(); await FLOW.boardingInfo(); await waitFor("#bank-combobox-input"); };
  const toOtpDialog = async () => { await toBankDialog(); await FLOW.bank(); };
  const HOLD = 2600;
  const ERR_RATE = BASE_RATE * 0.5; // 異常處理四支手機：比流程步驟再快一些
  const ERR_HOLD = 3900;            // 錯誤訊息停留（依倍率換算後約 1.3 秒）
  // 異常情境模式：操作加快，原型自己的等待（上傳中、思考中）也縮短一半
  function errMode() {
    setRate(ERR_RATE);
    window.setTimeout = (callback, delay, ...args) => nativeSetTimeout(callback, (Number(delay) || 0) / 2, ...args);
  }

  // ---- 各步驟腳本 ----
  // 每一步都停在「按下送出」的那一刻（finalPress），不會播到下一步的畫面。
  // 這裡只播正確流程；錯誤情境統一放在簡報下方的「異常處理」段落展示。
  const SCRIPTS = {
    // 01 提出理賠：點快速選單直接觸發理賠 → 適用條件與應備文件 → 按下確認申請
    "01": async () => {
      await sleep(900);
      await tap(".suggestion[data-prompt='我想申請班機延誤理賠']", { pause: 300 });
      hideCursor();
      await waitFor("[data-chat-action='claim-confirm']");
      await sleep(1200);
      await scrollBox(document.querySelector("#chat-screen"), "bottom", 1800); // 用計時器捲動，分頁在背景時也能跑完
      await sleep(600);
      await finalPress("[data-chat-action='claim-confirm']");
    },

    // 02 身分驗證：輸入帳號、密碼、驗證碼 → 按下登入
    "02": async () => {
      await fastForward(toClaimButtons);
      await sleep(600);
      await FLOW.loginOpen();
      await sleep(400);
      await type("#login-id", SAMPLE.id, { perChar: 55 });
      await type("#login-password", SAMPLE.password, { perChar: 55 });
      await type("#login-captcha-input", SAMPLE.captcha, { perChar: 110 });
      await finalPress("#auth-primary");
    },

    // 02A 會員註冊：基本資料 → 聲明事項 → 動態密碼 → 設定密碼 → 按下送出
    "02A": async () => {
      await fastForward(toClaimButtons);
      setRate(BASE_RATE * 0.7);
      await sleep(600);
      await FLOW.signupOpen();
      await FLOW.signupBasic();
      await FLOW.signupStatements();
      await FLOW.signupOtp();
      await FLOW.signupPasswordFill();
      setRate(BASE_RATE);
      await finalPress("#auth-primary");
    },

    // 03 個資聲明：直接點「滑至最底」→ 按下同意
    "03": async () => {
      await fastForward(toLoginDone);
      await FLOW.consent();
      await sleep(500);
      await finalPress("#personal-data-agree");
    },

    // 04 登機證辨識：選好登機證 → 按下確認上傳
    "04": async () => {
      await fastForward(toUploadDialog);
      await sleep(700);
      await FLOW.pickFile("paper-boarding-pass");
      await sleep(400);
      await finalPress("#upload-confirm");
    },

    // 05 航班資訊確認：辨識結果已帶入 → 示範機場搜尋 → 按下確認資訊
    "05": async () => {
      await fastForward(toBoardingInfo);
      await waitFor("#confirm-info");
      await sleep(900);
      await type("#origin-airport", "杜拜", { perChar: 320 });
      await sleep(900);
      await tap("#origin-airport-options [data-airport-option][data-value='DXB']", { pause: 500 });
      await finalPress("#confirm-info");
    },

    // 06 延誤證明：選好檔案 → 按下確認上傳
    "06": async () => {
      await fastForward(async () => {
        await toBoardingInfo();
        await FLOW.boardingInfo({ edit: true });
        await waitFor("#upload-help-trigger");
      });
      await sleep(800);
      await FLOW.pickFile("proof-sample-pdf");
      await sleep(400);
      await finalPress("#upload-confirm");
    },

    // 07 匯款資料：銀行、分行、帳號 → 按下確認資訊
    "07": async () => {
      await fastForward(toBankDialog);
      await FLOW.bankFill();
      await finalPress("#confirm-bank-info");
    },

    // 08 動態密碼驗證：輸入動態密碼 → 按下送出申請
    "08": async () => {
      await fastForward(toOtpDialog);
      await FLOW.otpType();
      await finalPress("#otp-next");
    },

    // ---- 異常處理段落：四大分類各一個代表情境（發生錯誤 → 說明原因 → 提供下一步）----
    // E1 文件上傳與辨識｜文件無法辨識：說明原因，可重新上傳或改用手動輸入
    "E1": async () => {
      errMode();
      await fastForward(toUploadDialog);
      await sleep(700);
      await FLOW.pickFile("recognition-error");
      await FLOW.confirmUpload();
      await waitFor("[data-chat-action='retry-boarding-pass']");
      await sleep(ERR_HOLD);
      await finalPress("[data-chat-action='retry-boarding-pass']");
    },

    // E2 身分與驗證｜動態密碼已失效：提示已失效，可直接重新發送（Figma 09-08）
    "E2": async () => {
      errMode();
      await fastForward(toOtpDialog);
      await waitFor("#otp-input");
      await sleep(1600);
      // 原型的動態密碼 5 分鐘後失效；示範時把剩餘秒數撥到 1 秒，讓它自己走到失效狀態
      otpExpirySeconds = 1; // app.js 的全域變數
      await waitText("動態密碼已失效");
      await sleep(ERR_HOLD);
      await finalPress("#otp-resend");
    },

    // E3 資料與查詢｜檔案大小與格式錯誤：逐一標出問題檔案，刪除後重新上傳（Figma 08-07）
    "E3": async () => {
      errMode();
      await fastForward(async () => {
        await toBoardingInfo();
        await FLOW.boardingInfo({ edit: true });
        await waitFor("#upload-help-trigger");
      });
      await sleep(800);
      await FLOW.pickFile("proof-sample-pdf"); // 正常檔案
      await FLOW.pickFile("docx-large");       // 超過 10 MB
      await FLOW.pickFile("zip");              // 不支援的格式
      hideCursor();
      await waitText("此檔案格式不支援");
      await sleep(ERR_HOLD);
      await finalPress(".upload-file-item.has-error .upload-file-remove");
    },

    // E4 系統與對話｜系統異常：說明狀況，引導前往會員中心申請（Figma 06-14）
    // 原型在登機證上傳沒有系統異常的分支，這裡用延誤證明上傳時的系統異常示範，訊息與按鈕相同
    "E4": async () => {
      errMode();
      await fastForward(async () => {
        await toBoardingInfo();
        await FLOW.boardingInfo({ edit: true });
        await waitFor("#upload-help-trigger");
      });
      await sleep(700);
      await FLOW.pickFile("system-error");
      await FLOW.confirmUpload();
      await waitFor("[data-chat-action='claim-member']");
      await sleep(ERR_HOLD);
      await finalPress("[data-chat-action='claim-member']");
    },

    // 09 送出與回饋：已送出、顯示案件編號 → 選「有點卡住」→ 接續詢問原因 → 完成
    "09": async () => {
      await fastForward(async () => { await toOtpDialog(); await FLOW.otpType(); await FLOW.otpSubmit(); });
      await sleep(2200);
      await FLOW.feedback();
      hideCursor();
      await sleep(HOLD);
    },
  };

  async function run() {
    const script = SCRIPTS[STEP] || SCRIPTS["01"];
    try {
      if (STEP === "01") await startGate();
      await script();
      debugLog("done");
    } catch (error) {
      console.warn(error);
      debugLog("error", error && error.message);
      keepCursor = false;
      await sleep(2000);
    }
    if (!keepCursor) hideCursor();
    // 網址帶 aponce=1 時只播一次：停在最後畫面，並通知外層頁面可以顯示重播。
    if (new URLSearchParams(window.location.search).get("aponce") === "1") {
      ended = true;
      notify("done");
      return;
    }
    stage.style.transition = "opacity .5s ease";
    stage.style.opacity = "0";
    await sleep(600);
    window.location.hash = "";
    window.location.reload();
  }

  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
})();
