# 班機延誤｜線上易用性測試

這個專案包含：
- `public/index.html`：包含操作前問卷、情境說明、阿發操作與測後回饋的線上測試頁面
- `public/admin.html`：研究後台
- `public/flow/`：嵌入第四頁的阿發 HTML、CSS、JavaScript 與圖片資產
- `public/tracker-bridge.js`：核心流程往外層問卷傳送事件的橋接
- `src/index.js`：Cloudflare Worker API
- `schema.sql`：D1 資料表
- `wrangler.jsonc`：Workers 設定

## 1. 建立 D1
```bash
npx wrangler d1 create flight-delay-usability
```
把 Cloudflare 回傳的有效 `database_id` 填入 `wrangler.jsonc`。目前若仍是範例提示文字，部署會失敗；不要自行填入資料庫名稱代替 ID。

## 2. 建立資料表
```bash
npx wrangler d1 execute flight-delay-usability --file=schema.sql --remote
```

## 3. 設定後台金鑰
```bash
npx wrangler secret put ADMIN_KEY
```

## 4. 部署
```bash
npx wrangler deploy
```

首頁：
`https://你的-worker.workers.dev/`

後台：
`https://你的-worker.workers.dev/admin`

API：
`https://你的-worker.workers.dev/api/`

Cloudflare Workers Static Assets 會將 `/admin` 對應到 `public/admin.html`；後台 API 仍由 Worker 的 `/api/admin/*` 路徑處理。後台還需要設定 `ADMIN_KEY` secret 才能讀取資料。

## 5. 阿發嵌入與事件追蹤

第三頁預設載入同一個 Worker 上的 `/flow/`，阿發頁面從 `dist/` 複製到 `public/flow/`，並以 `embed.css` 與 `embed.js` 配合手機畫面尺寸。`wrangler.jsonc` 的 `FLOW_URL` 可改成其他阿發網址；相對路徑會以問卷 Worker 的網域解析。

可直接用瀏覽器開啟 `public/index.html` 預覽。`file://` 本機預覽會使用假 session，資料不會寫入 D1；正式測試仍須使用部署後網址。

`public/flow/index.html` 已載入 `../tracker-bridge.js`。問卷頁面不會自動讀取 iframe 的操作，因此要在阿發互動節點呼叫 `ResearchTracker`，橋接才會把事件傳給問卷頁面；若之後改用跨來源網址，也不能直接讀取 iframe 內部狀態。僅載入橋接檔不會自動追蹤所有操作。

在關鍵節點呼叫：

```js
ResearchTracker.page("06-03", "登機證上傳");
ResearchTracker.retry({ reason: "ocr" });
ResearchTracker.ocrFail({ attempt: 1 });
ResearchTracker.aiEdit("flight_number", "CX566", "CX567");
ResearchTracker.recoveryFound({ method: "delay_certificate" });
ResearchTracker.success();
```

建議事件：
- 進入新頁：`ResearchTracker.page(...)`
- 返回：`ResearchTracker.back()`
- 重新嘗試：`ResearchTracker.retry()`
- 上傳文件：`ResearchTracker.uploadAttempt()`
- 上傳失敗：`ResearchTracker.uploadFail()`
- 登機證辨識失敗：`ResearchTracker.ocrFail()`
- 修改 AI 辨識資料：`ResearchTracker.aiEdit(...)`
- 找到延誤證明替代流程：`ResearchTracker.recoveryFound()`
- 完成送件：`ResearchTracker.success()`

## 後台目前可看
- 操作前問卷：搭機次數、旅遊險購買次數、班機延誤經驗、登機證使用偏好、紙本／電子登機證取得方式與保留習慣
- 第 5、6 題會依第 4 題選擇顯示，選擇「其他」時可填寫補充說明；答案可在明細與 CSV 匯出查看
- 任務資料卡可收合詳細個人資料，並提供一鍵代入測試資料
- 任務是否完成
- 完成時間
- 各頁停留時間
- 返回次數
- 重試次數
- 登機證辨識失敗次數
- 是否修改 AI 辨識資料
- 是否找到替代申請方式
- 放棄位置
- 操作路徑
- 測後回饋 1–3、7–9 題；B 組另有第 4–6 題
- 每題回饋答案可在受測者明細與 CSV 匯出查看
