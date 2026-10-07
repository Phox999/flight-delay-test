const app = document.querySelector(".app");
const researchParams = new URLSearchParams(window.location.search);
const isUsabilityResearch = researchParams.get("research") === "1";
const usabilityGroup = isUsabilityResearch && researchParams.get("group") === "B" ? "B" : "A";
const previewStage = document.querySelector("#preview-stage");
const previewFullscreenButton = document.querySelector("#preview-fullscreen");
const previewRestartButton = document.querySelector("#preview-restart");
const previewImmersiveButton = document.querySelector("#preview-immersive");
const previewFullscreenEnterIcon = previewFullscreenButton.querySelector("[data-fullscreen-enter]");
const previewFullscreenExitIcon = previewFullscreenButton.querySelector("[data-fullscreen-exit]");

const welcome = document.querySelector(".welcome");
const chatScreen = document.querySelector("#chat-screen");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const defaultMessagePlaceholder = input.placeholder;
const policyDialog = document.querySelector("#policy-dialog");
const policyTitle = document.querySelector("#dialog-title");
const policyCopy = document.querySelector("#dialog-copy");
const personalDataDialog = document.querySelector("#personal-data-dialog");
const personalDataCopy = document.querySelector("#personal-data-copy");
const personalDataAgree = document.querySelector("#personal-data-agree");
const scrollToAgree = document.querySelector("#scroll-to-agree");
const uploadDialog = document.querySelector("#upload-dialog");
const uploadTitle = document.querySelector("#upload-title");
const uploadFileInput = document.querySelector("#boarding-pass-input");
const uploadDropzone = document.querySelector("#upload-dropzone");
const uploadDropLabel = document.querySelector("#upload-drop-label");
const uploadFileList = document.querySelector("#upload-file-list");
const uploadError = document.querySelector("#upload-error");
const uploadConfirm = document.querySelector("#upload-confirm");
const uploadSourceMenu = document.querySelector("#upload-source-menu");
const uploadHelpWrap = document.querySelector("#upload-help-wrap");
const uploadHelpTrigger = document.querySelector("#upload-help-trigger");
const uploadHelpCopy = document.querySelector("#upload-help-copy");
const uploadHelpClose = document.querySelector("#upload-help-close");
const uploadSheet = uploadDialog.querySelector(".upload-sheet");
const uploadBody = uploadDialog.querySelector(".upload-body");
const uploadNotes = document.querySelector("#upload-notes");
const uploadLoading = document.querySelector("#upload-loading");
const filePickerScreen = document.querySelector("#file-picker-screen");
const filePickerSearch = document.querySelector("#file-picker-search");
const filePickerList = document.querySelector("#file-picker-list");
const boardingInfoDialog = document.querySelector("#boarding-info-dialog");
const boardingInfoForm = document.querySelector("#boarding-info-form");
const confirmInfoButton = document.querySelector("#confirm-info");
const airportComboboxes = [...boardingInfoDialog.querySelectorAll("[data-airport]")];
const scheduledTimeDialog = document.querySelector("#scheduled-time-dialog");
const scheduledTimeForm = document.querySelector("#scheduled-time-form");
const scheduledDateInput = document.querySelector("#scheduled-date");
const scheduledHourInput = document.querySelector("#scheduled-hour");
const scheduledDateField = document.querySelector("#scheduled-date-field");
const scheduledHourField = document.querySelector("#scheduled-hour-field");
const confirmScheduledTimeButton = document.querySelector("#confirm-scheduled-time");
let boardingInfoValidationAttempted = false;
let boardingInfoConfirmed = false;
let boardingPassRecognitionFailures = 0;
let scheduledFlightTime = null;
let boardingInfoOriginalSnapshot = null;
let boardingInfoPreviousSnapshot = null;
let boardingInfoModificationCount = 0;
let boardingInfoHasSubstantiveEdits = false;
const bankInfoDialog = document.querySelector("#bank-info-dialog");
const bankInfoForm = document.querySelector("#bank-info-form");
let bankInfoClosePromptRetry = null;
const bankCombobox = document.querySelector("#bank-combobox");
const bankComboboxInput = document.querySelector("#bank-combobox-input");
const bankComboboxResults = document.querySelector("#bank-options");
const branchCombobox = document.querySelector("#branch-combobox");
const branchComboboxInput = document.querySelector("#branch-combobox-input");
const branchComboboxResults = document.querySelector("#branch-options");
const bankbookFileInput = document.querySelector("#bankbook-file-input");
const bankbookDropzone = document.querySelector("#bankbook-dropzone");
const bankbookSelected = document.querySelector("#bankbook-selected");
const bankbookSelectedName = document.querySelector("#bankbook-selected-name");
const bankbookRemove = document.querySelector("#bankbook-remove");
const bankbookError = document.querySelector("#bankbook-error");
const bankInfoLoading = document.querySelector("#bank-info-loading");
const confirmBankInfoButton = document.querySelector("#confirm-bank-info");
const bankAccountField = document.querySelector("#bank-account-field");
const bankAccountError = document.querySelector("#bank-account-error");
const otpDialog = document.querySelector("#otp-dialog");
const otpForm = document.querySelector("#otp-form");
const otpInput = document.querySelector("#otp-input");
const otpField = document.querySelector("#otp-field");
const otpError = document.querySelector("#otp-error");
const otpCountdown = document.querySelector("#otp-countdown");
const otpResend = document.querySelector("#otp-resend");
const otpNext = document.querySelector("#otp-next");
const otpHelp = document.querySelector("#otp-help");
const otpHelpTrigger = document.querySelector("#otp-help-trigger");
const otpHelpNote = document.querySelector("#otp-help-note");
const otpHelpClose = document.querySelector("#otp-help-close");
const authDialog = document.querySelector("#auth-dialog");
const authSheet = document.querySelector("#auth-sheet");
const signupNationalityField = document.querySelector("#signup-nationality-field");
const signupNationalitySelect = document.querySelector("#signup-nationality");
const signupNationalityTrigger = document.querySelector("#signup-nationality-trigger");
const signupNationalityValue = document.querySelector("#signup-nationality-value");
const signupNationalityControl = document.querySelector(".auth-nationality-control");
const signupNationalitySearchWrap = document.querySelector("#signup-nationality-search-wrap");
const signupNationalityMenu = document.querySelector("#signup-nationality-menu");
const signupNationalitySearch = document.querySelector("#signup-nationality-search");
const signupNationalityOptions = document.querySelector("#signup-nationality-options");
const signupNationalityEmpty = document.querySelector("#signup-nationality-empty");
const signupNationalityHelp = document.querySelector("#signup-nationality-help");
const signupNationalityTooltip = document.querySelector("#signup-nationality-tooltip");
const signupNationalityTooltipTail = signupNationalityTooltip.querySelector(".auth-nationality-tooltip-tail");
const loginOtpHelpTrigger = document.querySelector("#login-otp-help-trigger");
const loginOtpHelpNote = document.querySelector("#login-otp-help-note");
const loginOtpHelpClose = document.querySelector("#login-otp-help-close");
const authTitle = document.querySelector("#auth-title");
const authTabs = document.querySelector("#auth-tabs");
const authScroll = document.querySelector("#auth-scroll");
const authPrimary = document.querySelector("#auth-primary");
const authFooterPrompt = document.querySelector("#auth-footer-prompt");
const authBack = document.querySelector("#auth-back");
const signupStatementDialog = document.querySelector("#signup-statement-dialog");
const signupStatementTitle = document.querySelector("#signup-statement-title");
const signupStatementScroll = document.querySelector("#signup-statement-scroll");
const signupStatementScrollButton = document.querySelector("#signup-statement-scroll-button");
const signupStatementAgree = document.querySelector("#signup-statement-agree");
const authViews = [...authDialog.querySelectorAll("[data-auth-view]")];
let previousAuthFocus = null;
let authOrigin = "claim";
let authReturnToLogin = false;
let authActiveView = "login-password";
let authSignupProfile = {};
let signupNationalityRevealed = false;
let authPasswordAttempts = 0;
let authPasswordLocked = false;
let authOtpPurpose = "";
let authOtpResendSeconds = 60;
let authOtpExpirySeconds = 300;
let authOtpAttemptCount = 0;
let signupNationalityActiveValue = "";
let authOtpExpired = false;
let authIsVerifying = false;
let activeSignupStatement = "";
let previousSignupStatementFocus = null;
const signupStatementsRead = new Set();
let authOtpInterval = null;
let authVerifyTimer = null;
let registeredMemberIds = new Set();
let authCaptchaCode = "04WG";
let authLoginOtpPhone = "0963-****30";
let authLoginOtpEmail = "Cathay***@***il.com";
const taiwanBankDirectory = window.taiwanBankDirectory ?? [];
const bankDirectoryByCode = new Map(taiwanBankDirectory.map((bank) => [bank.code, bank]));
const bankSearchAliases = {
  "004": "台灣銀行 台灣銀行 Bank of Taiwan",
  "013": "國泰世華 Cathay United Bank",
  "700": "中華郵政 郵局 Chunghwa Post",
  "812": "台新銀行 Taishin Bank",
};
let bankbookUploadTimer = null;
let otpResendSeconds = 60;
let otpExpirySeconds = 300;
let otpAttemptCount = 0;
let otpExpired = false;
let otpIsVerifying = false;
let otpInterval = null;
let otpVerifyTimer = null;
const simulatedOtpCode = "123123";
const simulatedOtpApiErrorCode = "999999";
const memberCenterUrl = "https://www.cathay-ins.com.tw/INSOCWeb/";
const confirmDialog = document.querySelector("#confirm-dialog");
const confirmCopy = document.querySelector("#confirm-copy");
const confirmGo = document.querySelector("#confirm-go");
const officialClaimUrl = "https://www.cathay-ins.com.tw/cathayins/personal/claim/travel/";
const generalClaimUrl = "https://www.cathay-ins.com.tw/cathayins/personal/claim/";
let previousPolicyFocus = null;
let previousPersonalDataFocus = null;
let previousUploadFocus = null;
let selectedBoardingPass = null;
let selectedDelayProofFiles = [];
let uploadMode = "boarding-pass";
let filePickerTarget = "upload";
let networkErrorShown = false;
let uploadTimer = null;
let uploadFileSequence = 0;
const uploadLoadingDurationMs = 2800;

function updatePreviewFullscreenControl() {
  const isFullscreen = document.fullscreenElement === previewStage || previewStage.classList.contains("is-fullscreen");
  const isImmersive = previewStage.classList.contains("is-immersive");
  previewFullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
  previewFullscreenButton.setAttribute("aria-label", isFullscreen ? "退出全螢幕" : "進入全螢幕");
  previewFullscreenButton.title = isFullscreen ? "退出全螢幕" : "全螢幕";
  previewFullscreenEnterIcon.hidden = isFullscreen;
  previewFullscreenExitIcon.hidden = !isFullscreen;
  previewImmersiveButton.setAttribute("aria-pressed", String(isImmersive));
  previewImmersiveButton.setAttribute("aria-label", isImmersive ? "退出沉浸全螢幕" : "進入沉浸全螢幕");
  previewImmersiveButton.title = isImmersive ? "退出沉浸全螢幕" : "沉浸全螢幕";
}

previewFullscreenButton.addEventListener("click", async () => {
  const isFullscreen = document.fullscreenElement === previewStage || previewStage.classList.contains("is-fullscreen");
  if (isFullscreen) {
    if (document.fullscreenElement === previewStage && document.exitFullscreen) await document.exitFullscreen();
    previewStage.classList.remove("is-fullscreen", "is-immersive");
  } else if (previewStage.requestFullscreen) {
    try {
      await previewStage.requestFullscreen();
    } catch {
      previewStage.classList.add("is-fullscreen");
    }
  } else {
    previewStage.classList.add("is-fullscreen");
  }
  updatePreviewFullscreenControl();
});

previewImmersiveButton.addEventListener("click", async () => {
  const isImmersive = previewStage.classList.contains("is-immersive");
  if (isImmersive) {
    if (document.fullscreenElement === previewStage && document.exitFullscreen) await document.exitFullscreen();
    previewStage.classList.remove("is-fullscreen", "is-immersive");
  } else {
    previewStage.classList.add("is-immersive");
    if (document.fullscreenElement !== previewStage && previewStage.requestFullscreen) {
      try {
        await previewStage.requestFullscreen();
      } catch {
        previewStage.classList.add("is-fullscreen");
      }
    } else if (!previewStage.requestFullscreen) {
      previewStage.classList.add("is-fullscreen");
    }
  }
  updatePreviewFullscreenControl();
});

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement !== previewStage) {
    previewStage.classList.remove("is-fullscreen", "is-immersive");
  }
  updatePreviewFullscreenControl();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (previewStage.classList.contains("is-fullscreen") || previewStage.classList.contains("is-immersive"))) {
    if (document.fullscreenElement === previewStage && document.exitFullscreen) void document.exitFullscreen().catch(() => {});
    previewStage.classList.remove("is-fullscreen", "is-immersive");
    updatePreviewFullscreenControl();
  }
});
previewRestartButton.addEventListener("click", () => window.location.reload());

// Common commercial airports. Search supports IATA code, Traditional Chinese city,
// and English city/airport aliases; the first entries stay familiar in the menu.
const airportDirectory = `
TPE|桃園|Taipei Taoyuan
DXB|杜拜|Dubai
NRT|成田|Tokyo Narita
LAX|洛杉磯|Los Angeles
HND|東京羽田|Tokyo Haneda
KIX|大阪關西|Osaka Kansai
ICN|首爾仁川|Seoul Incheon
HKG|香港|Hong Kong
SIN|新加坡|Singapore
BKK|曼谷素萬那普|Bangkok Suvarnabhumi
TSA|台北松山|Taipei Songshan
KHH|高雄|Kaohsiung
RMQ|台中|Taichung
HUN|花蓮|Hualien
TTT|台東|Taitung
MZG|澎湖馬公|Penghu Magong
KNH|金門|Kinmen
LZN|馬祖南竿|Matsu Nangan
MFK|馬祖北竿|Matsu Beigan
CYI|嘉義|Chiayi
PIF|屏東|Pingtung
FUK|福岡|Fukuoka
CTS|札幌新千歲|Sapporo Chitose
OKA|沖繩那霸|Okinawa Naha
NGO|名古屋中部|Nagoya Chubu
ITM|大阪伊丹|Osaka Itami
SDJ|仙台|Sendai
HIJ|廣島|Hiroshima
KOJ|鹿兒島|Kagoshima
KMJ|熊本|Kumamoto
KMQ|小松|Komatsu
TAK|高松|Takamatsu
MYJ|松山|Matsuyama
AOJ|青森|Aomori
AKJ|旭川|Asahikawa
OIT|大分|Oita
ASJ|奄美|Amami
GMP|首爾金浦|Seoul Gimpo
PUS|釜山|Busan
CJU|濟州|Jeju
TAE|大邱|Daegu
CJJ|清州|Cheongju
PEK|北京首都|Beijing Capital
PKX|北京大興|Beijing Daxing
PVG|上海浦東|Shanghai Pudong
SHA|上海虹橋|Shanghai Hongqiao
CAN|廣州|Guangzhou
SZX|深圳|Shenzhen
CTU|成都雙流|Chengdu Shuangliu
TFU|成都天府|Chengdu Tianfu
HGH|杭州|Hangzhou
XMN|廈門|Xiamen
FOC|福州|Fuzhou
WUH|武漢|Wuhan
XIY|西安|Xi'an
NKG|南京|Nanjing
CKG|重慶|Chongqing
KMG|昆明|Kunming
SHE|瀋陽|Shenyang
DLC|大連|Dalian
HRB|哈爾濱|Harbin
TAO|青島|Qingdao
CSX|長沙|Changsha
NGB|寧波|Ningbo
WUX|無錫|Wuxi
TNA|濟南|Jinan
CGO|鄭州|Zhengzhou
URC|烏魯木齊|Urumqi
LHW|蘭州|Lanzhou
KWE|貴陽|Guiyang
YNT|煙台|Yantai
YIH|宜昌|Yichang
MFM|澳門|Macau
MNL|馬尼拉|Manila
CEB|宿霧|Cebu
CRK|克拉克|Clark
DMK|曼谷廊曼|Bangkok Don Mueang
HKT|普吉島|Phuket
CNX|清邁|Chiang Mai
USM|蘇梅島|Koh Samui
KUL|吉隆坡|Kuala Lumpur
PEN|檳城|Penang
BKI|亞庇|Kota Kinabalu
KCH|古晉|Kuching
LGK|蘭卡威|Langkawi
CGK|雅加達|Jakarta
DPS|峇里島|Bali Denpasar
SUB|泗水|Surabaya
KNO|棉蘭|Medan
UPG|望加錫|Makassar
SGN|胡志明市|Ho Chi Minh City
HAN|河內|Hanoi
DAD|峴港|Da Nang
CXR|芽莊金蘭|Nha Trang Cam Ranh
PQC|富國島|Phu Quoc
PNH|金邊|Phnom Penh
REP|暹粒|Siem Reap
VTE|永珍|Vientiane
LPQ|龍坡邦|Luang Prabang
RGN|仰光|Yangon
MDL|曼德勒|Mandalay
DAC|達卡|Dhaka
CGP|吉大港|Chattogram
KTM|加德滿都|Kathmandu
DEL|德里|Delhi
BOM|孟買|Mumbai
BLR|班加羅爾|Bengaluru
MAA|清奈|Chennai
HYD|海德拉巴|Hyderabad
CCU|加爾各答|Kolkata
GOI|果阿|Goa
CMB|可倫坡|Colombo
MLE|馬列|Male
KHI|喀拉蚩|Karachi
LHE|拉合爾|Lahore
ISB|伊斯蘭馬巴德|Islamabad
AUH|阿布達比|Abu Dhabi
DOH|杜哈|Doha
BAH|巴林|Bahrain
RUH|利雅德|Riyadh
JED|吉達|Jeddah
KWI|科威特|Kuwait City
MCT|馬斯開特|Muscat
AMM|安曼|Amman
TLV|特拉維夫|Tel Aviv
BEY|貝魯特|Beirut
CAI|開羅|Cairo
LHR|倫敦希斯洛|London Heathrow
LGW|倫敦蓋威克|London Gatwick
MAN|曼徹斯特|Manchester
EDI|愛丁堡|Edinburgh
CDG|巴黎戴高樂|Paris Charles de Gaulle
ORY|巴黎奧利|Paris Orly
AMS|阿姆斯特丹|Amsterdam
FRA|法蘭克福|Frankfurt
MUC|慕尼黑|Munich
BER|柏林|Berlin
DUS|杜塞道夫|Dusseldorf
ZRH|蘇黎世|Zurich
GVA|日內瓦|Geneva
VIE|維也納|Vienna
FCO|羅馬|Rome Fiumicino
MXP|米蘭|Milan Malpensa
MAD|馬德里|Madrid
BCN|巴塞隆納|Barcelona
LIS|里斯本|Lisbon
OPO|波多|Porto
ATH|雅典|Athens
IST|伊斯坦堡|Istanbul
SAW|伊斯坦堡薩比哈|Istanbul Sabiha
CPH|哥本哈根|Copenhagen
ARN|斯德哥爾摩|Stockholm
OSL|奧斯陸|Oslo
HEL|赫爾辛基|Helsinki
BRU|布魯塞爾|Brussels
PRG|布拉格|Prague
WAW|華沙|Warsaw
BUD|布達佩斯|Budapest
DUB|都柏林|Dublin
KEF|雷克雅維克|Reykjavik
OTP|布加勒斯特|Bucharest
SOF|索菲亞|Sofia
ZAG|札格瑞布|Zagreb
LJU|盧布爾雅那|Ljubljana
RIX|里加|Riga
VNO|維爾紐斯|Vilnius
TLL|塔林|Tallinn
JFK|紐約甘迺迪|New York JFK
EWR|紐華克|Newark
LGA|紐約拉瓜地亞|New York LaGuardia
BOS|波士頓|Boston
IAD|華盛頓杜勒斯|Washington Dulles
DCA|華盛頓雷根|Washington Reagan
ORD|芝加哥|Chicago O'Hare
ATL|亞特蘭大|Atlanta
MIA|邁阿密|Miami
MCO|奧蘭多|Orlando
LAS|拉斯維加斯|Las Vegas
DEN|丹佛|Denver
PHX|鳳凰城|Phoenix
IAH|休士頓|Houston
DFW|達拉斯|Dallas Fort Worth
MSP|明尼阿波利斯|Minneapolis
DTW|底特律|Detroit
PDX|波特蘭|Portland
SAN|聖地牙哥|San Diego
SFO|舊金山|San Francisco
SJC|聖荷西|San Jose
SEA|西雅圖|Seattle
YVR|溫哥華|Vancouver
YYZ|多倫多|Toronto
YUL|蒙特婁|Montreal
YOW|渥太華|Ottawa
MEX|墨西哥城|Mexico City
CUN|坎昆|Cancun
GRU|聖保羅|Sao Paulo
GIG|里約熱內盧|Rio de Janeiro
EZE|布宜諾斯艾利斯|Buenos Aires
SCL|聖地牙哥|Santiago Chile
LIM|利馬|Lima
BOG|波哥大|Bogota
SJO|聖荷西|San Jose Costa Rica
PTY|巴拿馬市|Panama City
SYD|雪梨|Sydney
MEL|墨爾本|Melbourne
BNE|布里斯本|Brisbane
PER|伯斯|Perth
ADL|阿德雷德|Adelaide
AKL|奧克蘭|Auckland
CHC|基督城|Christchurch
NAN|楠迪|Nadi
CPT|開普敦|Cape Town
JNB|約翰尼斯堡|Johannesburg
DUR|德班|Durban
NBO|奈洛比|Nairobi
ADD|阿迪斯阿貝巴|Addis Ababa
CMN|卡薩布蘭卡|Casablanca
LOS|拉各斯|Lagos
ACC|阿克拉|Accra
DAR|三蘭港|Dar es Salaam
`.trim().split("\n").map((entry) => {
  const [code, city, englishName] = entry.split("|");
  return { code, city, englishName };
}).sort((a, b) => a.code.localeCompare(b.code));

const policyParagraphs = [
  "本服務透過生成式人工智慧（Gen AI）系統之協助，可幫助您自本公司官方網站之公開資訊或本公司預先準備之常見問答集中，快速查詢本公司各項服務與產品資訊，並產出相應的回覆。",
  "為提供更精準的搜尋結果，請使用完整且清晰的句子描述您的需求，若提問描述不夠明確，本服務可能無法精準回覆，您可以嘗試重新表達需求，或聯繫本公司客服尋求協助。",
  "本服務生成之內容有其內在限制及與現實情況所存在之潛在落差，可能存在不完整、不準確或非預期之結果，且本服務所參考的相關資料可能有更新之時間差，故本公司提供之服務與產品相關資訊，仍以本公司官方網站所揭露之資訊為準。",
  "為保障個人資料安全，請勿在對話中輸入任何屬於您或他人的敏感性資料或隱私資訊（如：身分證字號、聯絡方式、帳務資訊等）。",
  "因生成式 AI 系統特性，本公司對同一用戶每日（00:00–23:59）可使用本服務業務詢問之次數設有上限。若達上限時，您將會收到系統提醒，且當日無法再於本服務中傳送其他訊息。",
];

const personalDataParagraphs = [
  "本公司蒐集您的個人資料後，依個人資料保護法之規定，您可以向本公司行使下列各項權利：",
  "(1) 查詢或請求閱覽您的個人資料",
  "(2) 請求製給您的個人資料複製本",
  "(3) 請求補充或更正您的個人資料",
  "(4) 請求停止蒐集、處理或利用您的個人資料",
  "(5) 請求刪除您的個人資料",
  "您可以至各服務中心或與本公司客服專線 (0800-212-880 ) 聯繫，本公司將儘速依相關法令規定，處理與回覆您的請求。",
  "個人資料保護法應告知事項",
  "親愛的客戶，您好：",
  "國泰世紀產物保險股份有限公司（以下稱本公司）依據個人資料保護法（以下稱個資法）第八條及第九條規定，向台端告知下列事項，請台端詳閱：",
  "一、 蒐集之目的：辦理財產保險(093)、人身保險(001)、行銷(040)及其他合於營業登記項目或組織章程所定之業務(181)。",
  "二、 蒐集之個人資料類別：包括但不限於姓名、身分證統一編號、聯絡方式、本網站瀏覽或查詢時伺服器自行產生的相關紀錄(包括但不限於您使用設備的 IP 位址、使用的瀏覽器、使用時間、瀏覽及點選資料紀錄等)等，詳如要保書或相關業務申請書內容。",
  "三、 個人資料之來源（個人資料非由當事人提供間接蒐集之情形適用）：",
  "(一) 要保人/被保險人/受益人",
  "(二) 司法警憲機關、委託協助處理理賠之公證人或機構",
  "(三) 當事人之法定代理人、輔助人",
  "(四) 各醫療院所",
  "(五) 與第三人共同行銷、交互運用客戶資料、合作推廣等關係、或於本公司各項業務內所委託往來之第三人。",
  "(六) 經當事人同意授權之同一金融控股公司所屬銀行子公司之網路銀行帳戶",
  "四、 個人資料利用之期間、對象、地區及方式：",
  "(一) 期間：因執行業務所必須及依法令規定應為保存之期間。",
  "(二) 對象：本(分)公司及本公司海外分支機構、中華民國產物保險商業同業公會、中華民國人壽保險商業同業公會、財團法人保險事業發展中心、財團法人保險安定基金、財團法人住宅地震保險基金、財團法人汽車交通事故特別補償基金、 財團法人保險犯罪防制中心、財團法人金融消費評議中心、財團法人金融聯合徵信中心、財團法人聯合信用卡中心、台灣票據交換所、財金資訊公司、關貿網路股份有限公司、中央健康保險局、業務委外機構、與本公司有再保業務往來之公司、 依法有調查權機關或金融監理機關。",
  "(三) 地區：上述對象所在之地區。",
  "(四) 方式：合於法令規定之利用方式。",
  "五、 依據個資法第三條規定，台端就本公司保有台端之個人資料得行使之權利及方式：",
  "(一) 得向本公司行使之權利：",
  "1. 向本公司查詢、請求閱覽或請求製給複製本。",
  "2. 向本公司請求補充或更正。",
  "3. 向本公司請求停止蒐集、處理或利用及請求刪除。",
  "(二) 行使權利之方式：書面或其他日後可供證明之方式。",
  "六、 台端不提供個人資料所致權益之影響：台端若未能提供相關個人資料時，本公司將可能延後或無法進行必要之審核及處理作業，因此可能婉謝承保、遲延或無法提供台端完善的保險服務(視業務性質)",
  "【註】",
  "1. 上開告知事項已公告於本公司官網，如有問題歡迎洽詢本公司 0800-212-880，免付費客服專線。",
  "2. 本告知事項內容若有更動，係以官網公告為準。",
];

function setScreen(showChat) {
  app.classList.toggle("is-chat", showChat);
  welcome.hidden = showChat;
  chatScreen.hidden = !showChat;
}

function keepChatHash() {
  if (window.location.hash !== "#chat") window.location.hash = "chat";
}

function makeAvatar() {
  const avatar = document.createElement("div");
  avatar.className = "assistant-avatar";
  avatar.setAttribute("role", "img");
  avatar.setAttribute("aria-label", "阿發");
  avatar.dataset.component = "img/Alpha/32x32";

  const face = document.createElement("img");
  face.className = "mascot-face";
  face.src = "assets/mascot-face.png";
  face.alt = "";
  avatar.append(face);

  const starPosition = document.createElement("span");
  starPosition.className = "avatar-star-position";
  starPosition.setAttribute("aria-hidden", "true");
  const starInset = document.createElement("span");
  starInset.className = "avatar-star-inset";
  const star = document.createElement("img");
  star.className = "mascot-star";
  star.src = "assets/mascot-star.svg";
  star.alt = "";
  starInset.append(star);
  starPosition.append(starInset);
  avatar.append(starPosition);
  return avatar;
}

function scrollChatToBottom() {
  requestAnimationFrame(() => { chatScreen.scrollTop = chatScreen.scrollHeight; });
}

function setComposerFlowLock(locked) {
  input.disabled = locked;
  input.placeholder = locked ? "請完成理賠申請流程後再聊天" : defaultMessagePlaceholder;
  sendButton.disabled = locked || input.value.trim().length === 0;
}

function appendUserMessage(message) {
  const row = document.createElement("div");
  row.className = "chat-user-row";
  const bubble = document.createElement("div");
  bubble.className = "chat-user-bubble";
  bubble.textContent = message;
  const time = document.createElement("p");
  time.className = "chat-time";
  time.textContent = "10:07 PM 送出";
  row.append(bubble, time);
  chatScreen.append(row);
  scrollChatToBottom();
}

function appendAssistantSequence(items) {
  const row = document.createElement("div");
  row.className = "assistant-row";
  const column = document.createElement("div");
  column.className = "assistant-content";

  let lastBubble = null;
  items.forEach(({ content, card = false, className = "" }) => {
    const bubble = document.createElement("div");
    bubble.className = `${card ? "assistant-card" : "assistant-bubble"}${className ? ` ${className}` : ""}`;
    if (typeof content === "string") {
      const paragraph = document.createElement("p");
      paragraph.textContent = content;
      bubble.append(paragraph);
    } else {
      bubble.append(content);
    }
    column.append(bubble);
    lastBubble = bubble;
  });

  const meta = document.createElement("div");
  meta.className = "chat-meta";
  const time = document.createElement("p");
  time.className = "chat-time";
  time.textContent = "10:07 PM 送出";
  meta.append(time);
  column.append(meta);
  row.append(makeAvatar(), column);
  chatScreen.append(row);
  scrollChatToBottom();
  return { row, column, lastBubble };
}

function appendAssistantMessage(content, { card = false, className = "" } = {}) {
  return appendAssistantSequence([{ content, card, className }]);
}

function makeAction(label, action, { primary = false } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `chat-action${primary ? " primary" : ""}`;
  button.textContent = label;
  button.dataset.chatAction = action;
  return button;
}

function disableChatActions(button) {
  button.closest(".chat-actions, .single-button-row")?.querySelectorAll("button").forEach((action) => { action.disabled = true; });
}

function appendDefaultConsultation() {
  appendUserMessage("我想詢問班機延誤相關問題");
  const answer = document.createElement("div");
  const intro = document.createElement("p");
  intro.textContent = "阿發為你整理常見問題：";
  const list = document.createElement("ol");
  [
    "班機延誤 4 小時以上，可以提出理賠申請。",
    "延誤時間會從「原訂起飛時間」開始計算，至實際搭乘的班機起飛為止。",
  ].forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });
  answer.append(intro, list);
  appendAssistantMessage(answer);
  appendAssistantMessage("你也可以直接描述你的班機延誤情況，阿發來為你解答~");
}

function startChat(prompt = "") {
  keepChatHash();
  setScreen(true);
  chatScreen.replaceChildren();
  boardingInfoValidationAttempted = false;
  boardingInfoConfirmed = false;
  boardingPassRecognitionFailures = 0;
  boardingInfoOriginalSnapshot = null;
  boardingInfoPreviousSnapshot = null;
  boardingInfoModificationCount = 0;
  boardingInfoHasSubstantiveEdits = false;
  if (!prompt) {
    appendDefaultConsultation();
    return;
  }
  appendUserMessage(prompt);
  replyTo(prompt);
}

function makeNumberedList(values, { lowerAlpha = false } = {}) {
  const list = document.createElement("ol");
  if (lowerAlpha) list.type = "a";
  values.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });
  return list;
}

function appendClaimDetails() {
  const details = document.createElement("div");
  const heading = document.createElement("p");
  heading.className = "claim-card-heading";
  heading.textContent = "班機延誤理賠注意事項";
  const list = document.createElement("ol");
  const applicability = document.createElement("li");
  applicability.append("本服務僅適用班機延誤後仍搭乘原航班。以下情況請改由產險官網或線下通路辦理：");
  applicability.append(makeNumberedList([
    "班機取消/改搭其他班機",
    "錯過轉機航班",
    "同時申請其他理賠項目",
  ], { lowerAlpha: true }));
  list.append(applicability);
  [
    "限個人件，且要保人與被保險人須為同一人",
    "須為班機延誤發生後二年內提出",
    "須為國泰產險會員",
  ].forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });
  details.append(heading, list);

  const prep = document.createElement("div");
  const prepTitle = document.createElement("p");
  prepTitle.className = "prep-title";
  prepTitle.textContent = "申請前請準備：";
  const prepList = makeNumberedList(["登機證", "本人匯款帳戶", "班機延誤證明（視情況）"], { lowerAlpha: true });
  prepList.className = "prep-list";
  const actions = document.createElement("div");
  actions.className = "info-confirm-actions";
  actions.append(
    makeAction("確認申請", "claim-confirm"),
    makeAction("加入國泰產險會員", "claim-register"),
    makeAction("前往國泰產險官網", "claim-website"),
  );
  prep.append(prepTitle, prepList, actions);

  appendAssistantSequence([
    { content: details, className: "claim-details-bubble" },
    { content: prep, card: true, className: "info-confirm-card" },
  ]);
}

function beginPersonalDataConsent({ appendUser = true } = {}) {
  if (appendUser) appendUserMessage("確認申請");
  const retry = appendConsentMessage("請先同意個資聲明才能繼續流程喔。");
  showPersonalDataNotice();
  previousPersonalDataFocus = retry;
  return retry;
}

function setAuthFieldError(inputId, message) {
  const field = document.getElementById(inputId)?.closest(".auth-field");
  const error = document.querySelector(`[data-auth-error-for="${inputId}"]`);
  if (!field || !error) return;
  const invalid = Boolean(message);
  field.classList.toggle("is-invalid", invalid);
  field.querySelector("input")?.setAttribute("aria-invalid", String(invalid));
  if (inputId === "signup-nationality") {
    signupNationalityTrigger?.setAttribute("aria-invalid", String(invalid));
    signupNationalitySearch?.setAttribute("aria-invalid", String(invalid));
  }
  error.hidden = !invalid;
  if (invalid) error.textContent = message;
}

function setAuthOtpError(inputId, errorId, message) {
  const inputElement = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  const field = inputElement?.closest(".auth-field");
  if (!inputElement || !error || !field) return;
  field.classList.toggle("is-invalid", Boolean(message));
  inputElement.setAttribute("aria-invalid", String(Boolean(message)));
  error.hidden = !message;
  if (message) error.textContent = message;
  if (inputId === "login-otp-input") {
    if (message) {
      loginOtpHelpNote.hidden = true;
      loginOtpHelpTrigger.setAttribute("aria-expanded", "false");
    }
  }
}

function clearAuthErrors(form) {
  form.querySelectorAll("[data-auth-error-for]").forEach((error) => {
    setAuthFieldError(error.dataset.authErrorFor, "");
  });
  form.querySelectorAll(".auth-field-error:not([data-auth-error-for])").forEach((error) => {
    error.hidden = true;
    error.textContent = "";
    error.closest(".auth-field")?.classList.remove("is-invalid");
  });
  form.querySelectorAll("[aria-invalid='true']").forEach((inputElement) => inputElement.setAttribute("aria-invalid", "false"));
}

function isTaiwanNationalId(value) {
  return /^[A-Z][12]\d{8}$/.test(value.trim().toUpperCase());
}

function isResidencePermitId(value) {
  const normalized = value.trim().toUpperCase();
  return /^[A-Z][89]\d{8}$/.test(normalized) || /^[A-Z]{2}\d{8}$/.test(normalized);
}

function isValidMemberId(value) {
  return isTaiwanNationalId(value) || isResidencePermitId(value);
}

function syncSignupNationalityField() {
  const identity = document.querySelector("#signup-id")?.value ?? "";
  const field = document.querySelector("#signup-nationality-field");
  if (!field) return;
  if (isResidencePermitId(identity)) signupNationalityRevealed = true;
  else if (isTaiwanNationalId(identity)) signupNationalityRevealed = false;
  field.hidden = !signupNationalityRevealed;
  if (field.hidden) {
    closeSignupNationalityMenu();
    if (signupNationalitySelect) signupNationalitySelect.value = "";
    syncSignupNationalityValue();
    setAuthFieldError("signup-nationality", "");
    closeSignupNationalityTooltip();
  }
}

function isValidLoginAccount(value) {
  const normalized = value.trim().toUpperCase();
  return /^[A-Z][12]\d{8}$/.test(normalized)
    || /^[A-Z][89]\d{8}$/.test(normalized)
    || /^[A-Z]{2}\d{8}$/.test(normalized);
}

function parseAuthBirthday(value) {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{8}$/.test(digits)) return null;
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function isAdultBirthday(value) {
  const birthday = parseAuthBirthday(value);
  if (!birthday) return false;
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) age -= 1;
  return age >= 18 && birthday <= today;
}

const signupStatementLabels = {
  privacy: "個人資料蒐集與告知事項",
  terms: "國泰產險網站服務使用約定書",
  "online-service": "網路保險服務聲明事項",
  "online-insurance": "網路投保聲明暨同意書",
};

function openSignupStatement(key) {
  const title = signupStatementLabels[key];
  if (!title) return;
  activeSignupStatement = key;
  previousSignupStatementFocus = document.activeElement;
  signupStatementTitle.textContent = title;
  signupStatementScroll.scrollTop = 0;
  const alreadyRead = signupStatementsRead.has(key);
  signupStatementAgree.disabled = !alreadyRead;
  signupStatementScrollButton.hidden = alreadyRead;
  signupStatementDialog.hidden = false;
  requestAnimationFrame(() => {
    signupStatementScroll.focus({ preventScroll: true });
    requestAnimationFrame(() => { signupStatementScroll.scrollTop = 0; });
  });
}

function closeSignupStatement({ restoreFocus = true } = {}) {
  if (signupStatementDialog.hidden) return;
  signupStatementDialog.hidden = true;
  activeSignupStatement = "";
  if (restoreFocus) previousSignupStatementFocus?.focus?.({ preventScroll: true });
  previousSignupStatementFocus = null;
}

function markSignupStatementRead() {
  if (!activeSignupStatement) return;
  signupStatementsRead.add(activeSignupStatement);
  signupStatementAgree.disabled = false;
  signupStatementScrollButton.hidden = true;
}

function isValidAuthPassword(value) {
  const sequential = /(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i;
  return value.length >= 8 && value.length <= 12 && /[A-Za-z]/.test(value) && /\d/.test(value) && /^[A-Za-z\d]+$/.test(value) && !sequential.test(value);
}

function isValidSignupName(value) {
  const name = value.trim();
  return /^[\p{L}][\p{L}\p{M}\p{Zs}.'’·-]*$/u.test(name)
    && !/[\u3100-\u312f\u31a0-\u31bf]/u.test(name);
}

function signupFieldError(inputId) {
  const value = (selector) => document.querySelector(selector)?.value.trim() ?? "";
  const identity = value("#signup-id").toUpperCase();
  if (inputId === "signup-id") {
    if (!isValidMemberId(identity)) return "請輸入正確的身分證或居留證號";
    if (registeredMemberIds.has(identity)) return "身分證或居留證號已被註冊";
  }
  if (inputId === "signup-nationality" && !document.querySelector("#signup-nationality-field").hidden && !value("#signup-nationality")) return "請輸入國籍";
  if (inputId === "signup-birthday" && !isAdultBirthday(value("#signup-birthday"))) return "請輸入正確的生日";
  if (inputId === "signup-name" && !isValidSignupName(value("#signup-name"))) return "請輸入正確的姓名";
  if (inputId === "signup-phone" && !/^09\d{8}$/.test(value("#signup-phone"))) return "請輸入正確的手機號碼";
  if (inputId === "signup-promo" && value("#signup-promo") && !/^[A-Z\d]{4,20}$/.test(value("#signup-promo"))) return "請輸入正確的活動碼";
  if (inputId === "signup-password" && !isValidAuthPassword(value("#signup-password"))) return "8-12位英數混合且不得為連續3碼及特殊符號";
  if (inputId === "signup-confirm-password" && value("#signup-confirm-password") && value("#signup-password") !== value("#signup-confirm-password")) return "密碼不一致";
  return "";
}

function populateSignupNationalities() {
  const select = document.querySelector("#signup-nationality");
  if (!select) return;
  const unavailable = new Set(["SS", "LB", "CD", "SD", "IR", "LY", "KP"]);
  const regions = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IS IT JE JM JO JP KE KG KH KI KM KN KR KW KY KZ LA LC LI LK LR LS LT LU LV MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SE SG SH SI SK SL SM SN SO SR ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
  const displayNames = typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["zh-Hant-TW"], { type: "region" })
    : null;
  const options = regions.filter((code) => !unavailable.has(code)).map((code) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = displayNames?.of(code) || code;
    return option;
  });
  options.sort((a, b) => a.textContent.localeCompare(b.textContent, "zh-Hant-TW"));
  options.forEach((option) => select.append(option));
  syncSignupNationalityValue();
  renderSignupNationalityOptions();
}

populateSignupNationalities();

function syncSignupNationalityValue() {
  if (!signupNationalitySelect || !signupNationalityValue) return;
  const selected = signupNationalitySelect.selectedOptions[0];
  signupNationalityValue.textContent = selected?.value ? selected.textContent : "輸入國籍";
  signupNationalityValue.classList.toggle("is-placeholder", !selected?.value);
}

function renderSignupNationalityOptions() {
  if (!signupNationalitySelect || !signupNationalityOptions) return;
  const query = signupNationalitySearch?.value.trim().toLocaleLowerCase("zh-Hant-TW") || "";
  const availableOptions = [...signupNationalitySelect.options]
    .filter((option) => option.value && option.textContent.toLocaleLowerCase("zh-Hant-TW").includes(query));
  signupNationalityOptions.replaceChildren();
  availableOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "airport-option";
    button.id = `signup-nationality-option-${option.value.toLowerCase()}`;
    button.type = "button";
    button.role = "option";
    button.tabIndex = -1;
    button.dataset.nationalityValue = option.value;
    button.setAttribute("aria-selected", String(option.value === signupNationalitySelect.value));
    button.setAttribute("aria-posinset", String(index + 1));
    button.setAttribute("aria-setsize", String(availableOptions.length));
    button.textContent = option.textContent;
    signupNationalityOptions.append(button);
  });
  signupNationalityEmpty.hidden = availableOptions.length > 0;
  if (!availableOptions.some((option) => option.value === signupNationalityActiveValue)) {
    signupNationalityActiveValue = availableOptions.find((option) => option.value === signupNationalitySelect.value)?.value
      || availableOptions[0]?.value
      || "";
  }
  setActiveSignupNationalityOption(signupNationalityActiveValue);
}

function setActiveSignupNationalityOption(value) {
  signupNationalityActiveValue = value;
  const options = [...signupNationalityOptions.querySelectorAll("[role='option']")];
  options.forEach((option) => option.classList.toggle("is-active", option.dataset.nationalityValue === value));
  const active = options.find((option) => option.dataset.nationalityValue === value);
  if (active) {
    signupNationalitySearch.setAttribute("aria-activedescendant", active.id);
    if (!signupNationalityMenu.hidden) active.scrollIntoView({ block: "nearest" });
  } else {
    signupNationalitySearch.removeAttribute("aria-activedescendant");
  }
}

function positionSignupNationalityMenu() {
  if (signupNationalityMenu.hidden || !signupNationalityControl) return;
  const dialogRect = authDialog.getBoundingClientRect();
  const controlRect = signupNationalityControl.getBoundingClientRect();
  const scaleX = dialogRect.width / (authDialog.offsetWidth || dialogRect.width) || 1;
  const scaleY = dialogRect.height / (authDialog.offsetHeight || dialogRect.height) || 1;
  const fieldTop = (controlRect.top - dialogRect.top) / scaleY;
  const fieldBottom = (controlRect.bottom - dialogRect.top) / scaleY;
  const above = fieldTop;
  const below = authDialog.offsetHeight - fieldBottom;
  const naturalHeight = Math.max(signupNationalityOptions.scrollHeight, signupNationalityEmpty.hidden ? 0 : signupNationalityEmpty.offsetHeight);
  const desiredHeight = Math.min(naturalHeight, 276);
  const opensAbove = below < desiredHeight && above > below;
  const available = Math.max(0, (opensAbove ? above : below) - 1);
  const maxHeight = Math.min(desiredHeight, available);
  signupNationalityControl.dataset.placement = opensAbove ? "above" : "below";
  signupNationalityMenu.dataset.placement = opensAbove ? "above" : "below";
  signupNationalityMenu.style.left = `${Math.max(0, (controlRect.left - dialogRect.left) / scaleX)}px`;
  signupNationalityMenu.style.width = `${controlRect.width / scaleX}px`;
  signupNationalityMenu.style.maxHeight = `${maxHeight}px`;
  signupNationalityOptions.style.maxHeight = `${maxHeight}px`;
  const menuHeight = signupNationalityMenu.offsetHeight;
  const top = opensAbove
    ? above - menuHeight
    : fieldBottom - 1;
  signupNationalityMenu.style.top = `${Math.max(0, Math.min(top, authDialog.offsetHeight - menuHeight))}px`;
}

function openSignupNationalityMenu() {
  if (signupNationalityField.hidden || authActiveView !== "signup-1") return;
  closeSignupNationalityTooltip();
  signupNationalityTrigger.hidden = true;
  signupNationalityControl.classList.add("is-open");
  signupNationalitySearchWrap.hidden = false;
  signupNationalityMenu.hidden = false;
  signupNationalityTrigger.setAttribute("aria-expanded", "false");
  signupNationalitySearch.setAttribute("aria-expanded", "true");
  signupNationalitySearch.value = "";
  signupNationalityActiveValue = signupNationalitySelect.value;
  renderSignupNationalityOptions();
  positionSignupNationalityMenu();
  requestAnimationFrame(() => signupNationalitySearch.focus({ preventScroll: true }));
}

function closeSignupNationalityMenu({ restoreFocus = false } = {}) {
  if (!signupNationalityMenu || signupNationalityMenu.hidden) return;
  signupNationalityMenu.hidden = true;
  signupNationalitySearchWrap.hidden = true;
  signupNationalityTrigger.hidden = false;
  signupNationalityControl.classList.remove("is-open");
  signupNationalityTrigger.setAttribute("aria-expanded", "false");
  signupNationalitySearch.setAttribute("aria-expanded", "false");
  signupNationalitySearch.value = "";
  signupNationalitySearch.removeAttribute("aria-activedescendant");
  signupNationalityActiveValue = signupNationalitySelect.value;
  renderSignupNationalityOptions();
  if (restoreFocus) signupNationalityTrigger.focus({ preventScroll: true });
}

function chooseSignupNationality(value) {
  if (![...signupNationalitySelect.options].some((option) => option.value === value)) return;
  signupNationalitySelect.value = value;
  syncSignupNationalityValue();
  signupNationalitySelect.dispatchEvent(new Event("change", { bubbles: true }));
  closeSignupNationalityMenu({ restoreFocus: true });
}

function moveSignupNationalityActiveOption(direction) {
  const options = [...signupNationalityOptions.querySelectorAll("[role='option']")];
  if (!options.length) return;
  const index = options.findIndex((option) => option.dataset.nationalityValue === signupNationalityActiveValue);
  const nextIndex = direction === "first" ? 0
    : direction === "last" ? options.length - 1
      : (index + direction + options.length) % options.length;
  setActiveSignupNationalityOption(options[nextIndex].dataset.nationalityValue);
}

function positionSignupNationalityTooltip() {
  if (signupNationalityTooltip.hidden) return;
  const dialogRect = authDialog.getBoundingClientRect();
  const helpRect = signupNationalityHelp.getBoundingClientRect();
  const scaleX = dialogRect.width / (authDialog.offsetWidth || dialogRect.width) || 1;
  const scaleY = dialogRect.height / (authDialog.offsetHeight || dialogRect.height) || 1;
  const dialogWidth = authDialog.offsetWidth;
  const dialogHeight = authDialog.offsetHeight;
  const anchorX = (helpRect.left - dialogRect.left) / scaleX + 8;
  const anchorY = (helpRect.top - dialogRect.top) / scaleY;
  const width = Math.min(300, dialogWidth - 16);
  const left = Math.max(8, Math.min(anchorX - 19.5, dialogWidth - width - 8));
  signupNationalityTooltip.style.width = `${width}px`;
  signupNationalityTooltip.style.left = `${left}px`;
  signupNationalityTooltipTail.style.marginLeft = `${Math.max(0, Math.min(width - 17, anchorX - left - 8.5))}px`;
  const tooltipHeight = signupNationalityTooltip.offsetHeight;
  const above = anchorY;
  const below = dialogHeight - anchorY - helpRect.height / scaleY;
  const opensAbove = above >= tooltipHeight + 4 || above > below;
  signupNationalityTooltip.dataset.placement = opensAbove ? "above" : "below";
  const top = opensAbove ? anchorY - tooltipHeight - 4 : anchorY + helpRect.height / scaleY + 4;
  signupNationalityTooltip.style.top = `${Math.max(8, Math.min(top, dialogHeight - tooltipHeight - 8))}px`;
}

function closeSignupNationalityTooltip({ restoreFocus = false } = {}) {
  if (!signupNationalityTooltip || signupNationalityTooltip.hidden) return;
  signupNationalityTooltip.hidden = true;
  signupNationalityHelp.setAttribute("aria-expanded", "false");
  if (restoreFocus) signupNationalityHelp.focus({ preventScroll: true });
}

function setAuthView(view, { focus = "" } = {}) {
  if (view !== "signup-1") closeSignupNationalityMenu();
  if (view !== "signup-1") closeSignupNationalityTooltip();
  if (view !== "login-code") {
    loginOtpHelpNote.hidden = true;
    loginOtpHelpTrigger.setAttribute("aria-expanded", "false");
  }
  authActiveView = view;
  authSheet.dataset.view = view;
  authViews.forEach((panel) => { panel.hidden = panel.dataset.authView !== view; });
  const isLogin = view.startsWith("login-");
  const signupTitles = { "signup-1": "會員註冊", "signup-2": "聲明事項", "signup-3": "動態密碼驗證", "signup-4": "設定密碼" };
  authTitle.textContent = signupTitles[view] || (view.startsWith("forgot-") ? "忘記密碼" : "登入");
  authTabs.hidden = !isLogin;
  authFooterPrompt.hidden = !isLogin;
  authBack.hidden = !view.startsWith("forgot-");
  authTabs.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    const selected = tab.dataset.authTab === (view === "login-password" ? "login-password" : isLogin ? "login-birthday" : "");
    tab.setAttribute("aria-selected", String(selected));
    if (tab.dataset.authTab === "login-birthday") tab.setAttribute("aria-controls", view === "login-code" ? "auth-view-login-code" : "auth-view-login-birthday");
  });

  const forms = {
    "login-password": ["auth-password-form", "登入"],
    "login-birthday": ["auth-birthday-form", "登入"],
    "login-code": ["login-code-form", "下一步"],
    "forgot-phone": ["forgot-phone-form", "下一步"],
    "forgot-code": ["forgot-code-form", "下一步"],
    "forgot-password": ["forgot-password-form", "確認修改"],
    "signup-1": ["signup-basic-form", "確認資訊"],
    "signup-2": ["signup-basic-form", "審閱完畢，確認送出"],
    "signup-3": ["signup-otp-form", "下一步"],
    "signup-4": ["signup-password-form", "下一步"],
  };
  const [formId] = forms[view];
  authPrimary.setAttribute("form", formId);
  if (view === "signup-2") authPrimary.removeAttribute("form");
  if (view === "signup-2") authPrimary.type = "button";
  else authPrimary.type = "submit";
  authScroll.scrollTop = 0;
  updateAuthPrimary();
  if (focus) requestAnimationFrame(() => document.querySelector(focus)?.focus({ preventScroll: true }));
}

function updateAuthPrimary() {
  const labels = {
    "login-password": "登入", "login-birthday": "登入", "login-code": "下一步",
    "forgot-phone": "下一步", "forgot-code": "下一步", "forgot-password": "確認修改",
    "signup-1": "確認資訊", "signup-2": "審閱完畢，確認送出", "signup-3": "下一步", "signup-4": "下一步",
  };
  const value = (selector) => document.querySelector(selector)?.value.trim() ?? "";
  let ready = false;
  let signupProfileValid = false;
  if (authActiveView === "login-password") ready = Boolean(value("#login-id") && value("#login-password") && value("#login-captcha-input") && !authPasswordLocked);
  else if (authActiveView === "login-birthday") ready = Boolean(value("#login-code-id") && value("#login-birthday"));
  else if (authActiveView === "login-code") ready = value("#login-otp-input").length === 6 && document.querySelector("#login-otp-error").hidden && !authOtpExpired && authOtpAttemptCount < 5;
  else if (authActiveView === "forgot-phone") ready = Boolean(value("#forgot-phone"));
  else if (authActiveView === "forgot-code") ready = value("#forgot-otp-input").length === 6 && !authOtpExpired && authOtpAttemptCount < 5;
  else if (authActiveView === "forgot-password") ready = Boolean(value("#forgot-new-password") && value("#forgot-confirm-password"));
  else if (authActiveView === "signup-1") {
    const signupForm = document.querySelector("#signup-basic-form");
    const identity = value("#signup-id").toUpperCase();
    const birthday = value("#signup-birthday");
    const nationality = value("#signup-nationality");
    const needsNationality = !document.querySelector("#signup-nationality-field").hidden;
    const name = value("#signup-name");
    const phone = value("#signup-phone");
    const promo = value("#signup-promo");
    signupProfileValid = Boolean(identity && birthday && (!needsNationality || nationality) && name && phone)
      && isValidMemberId(identity)
      && isAdultBirthday(birthday)
      && isValidSignupName(name)
      && /^09\d{8}$/.test(phone)
      && (!promo || /^[A-Z\d]{4,20}$/.test(promo))
      && !registeredMemberIds.has(identity);
    const hasRequiredValues = Boolean(identity && birthday && (!needsNationality || nationality) && name && phone);
    ready = signupForm?.dataset.validationAttempted === "true" ? signupProfileValid : hasRequiredValues;
  }
  else if (authActiveView === "signup-2") ready = [...authDialog.querySelectorAll("input[name='declaration']")].every((checkbox) => checkbox.checked) && document.querySelector("#signup-all-declarations").checked;
  else if (authActiveView === "signup-3") ready = value("#signup-otp-input").length === 6 && !authOtpExpired && authOtpAttemptCount < 5;
  else if (authActiveView === "signup-4") ready = isValidAuthPassword(value("#signup-password")) && Boolean(value("#signup-confirm-password")) && value("#signup-password") === value("#signup-confirm-password");
  authPrimary.textContent = authIsVerifying ? "驗證中..." : labels[authActiveView];
  authPrimary.disabled = !ready || authIsVerifying;
}

function syncSignupDeclarationMaster() {
  const declarations = [...authDialog.querySelectorAll("input[name='declaration']")];
  document.querySelector("#signup-all-declarations").checked = declarations.length > 0 && declarations.every((checkbox) => checkbox.checked);
}

function resetAuthFlow() {
  signupNationalityRevealed = false;
  closeSignupNationalityMenu();
  closeSignupNationalityTooltip();
  signupNationalityField.hidden = true;
  authDialog.querySelectorAll("form").forEach((form) => {
    form.reset();
    if (form.id === "signup-basic-form") form.dataset.validationAttempted = "false";
    form.querySelectorAll("input, select").forEach((inputElement) => { inputElement.disabled = false; });
    clearAuthErrors(form);
  });
  syncSignupNationalityValue();
  authDialog.querySelectorAll("[data-toggle-password]").forEach((button) => {
    const label = button.dataset.toggleLabel || "密碼";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `顯示${label}`);
    button.querySelector("img").src = "assets/auth-eye-closed.svg";
    document.getElementById(button.dataset.togglePassword).type = "password";
  });
  authDialog.querySelectorAll("input[name='declaration']").forEach((checkbox) => { checkbox.checked = false; });
  document.querySelector("#signup-all-declarations").checked = false;
  signupStatementsRead.clear();
  signupStatementDialog.hidden = true;
  activeSignupStatement = "";
  previousSignupStatementFocus = null;
  signupStatementAgree.disabled = true;
  signupStatementScrollButton.hidden = false;
  signupStatementScroll.scrollTop = 0;
  document.querySelector("#auth-status")?.remove();
  authSignupProfile = {};
  authPasswordAttempts = 0;
  authPasswordLocked = false;
  authIsVerifying = false;
  authOtpPurpose = "";
  authOtpResendSeconds = 59;
  authOtpExpirySeconds = 300;
  authOtpAttemptCount = 0;
  authOtpExpired = false;
  clearAuthOtpTimers();
  authPrimary.textContent = "登入";
  authCaptchaCode = "04WG";
  const captchaImage = document.querySelector("#auth-captcha-image");
  captchaImage.classList.remove("is-generated");
  captchaImage.src = "assets/login-captcha.png";
  document.querySelector("#login-captcha-input").value = "";
  captchaImage.alt = "圖形驗證碼";
}

function showAuthDialog({ origin = "claim", returnToLogin = false, returnFocus = document.activeElement } = {}) {
  previousAuthFocus = returnFocus;
  authOrigin = origin;
  authReturnToLogin = returnToLogin;
  authDialog.hidden = false;
  resetAuthFlow();
  setAuthView("login-password", { focus: "#login-id" });
}

function showSignupFlow({ returnToLogin = false } = {}) {
  signupNationalityRevealed = false;
  closeSignupNationalityMenu();
  closeSignupNationalityTooltip();
  signupNationalityField.hidden = true;
  authReturnToLogin = returnToLogin;
  authDialog.querySelectorAll("#signup-basic-form, #signup-otp-form, #signup-password-form").forEach((form) => {
    form.reset();
    if (form.id === "signup-basic-form") form.dataset.validationAttempted = "false";
    form.querySelectorAll("input, select").forEach((inputElement) => { inputElement.disabled = false; });
    clearAuthErrors(form);
  });
  syncSignupNationalityValue();
  authDialog.querySelectorAll("input[name='declaration']").forEach((checkbox) => { checkbox.checked = false; });
  document.querySelector("#signup-all-declarations").checked = false;
  signupStatementsRead.clear();
  signupStatementDialog.hidden = true;
  activeSignupStatement = "";
  previousSignupStatementFocus = null;
  signupStatementAgree.disabled = true;
  signupStatementScrollButton.hidden = false;
  signupStatementScroll.scrollTop = 0;
  authDialog.querySelectorAll("[data-toggle-password]").forEach((button) => {
    const inputElement = document.getElementById(button.dataset.togglePassword);
    const label = button.dataset.toggleLabel || "密碼";
    inputElement.type = "password";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `顯示${label}`);
    button.querySelector("img").src = "assets/auth-eye-closed.svg";
  });
  authSignupProfile = {};
  authIsVerifying = false;
  authOtpPurpose = "";
  clearAuthOtpTimers();
  setAuthView("signup-1", { focus: "#signup-id" });
}

function appendLoginDeclinedMessage() {
  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "沒有進行登入，不能申請班機延誤理賠喔。";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "chat-inline-action";
  retry.textContent = "返回繼續登入";
  retry.dataset.chatAction = "return-login";
  content.append(message, retry);
  appendAssistantMessage(content);
  retry.focus({ preventScroll: true });
  return retry;
}

function closeAuthDialog() {
  if (authDialog.hidden) return;
  closeSignupNationalityMenu();
  closeSignupNationalityTooltip();
  if (authReturnToLogin && authActiveView.startsWith("signup-")) {
    clearAuthOtpTimers();
    authIsVerifying = false;
    authReturnToLogin = false;
    setAuthView("login-password", { focus: "#login-id" });
    return;
  }
  authDialog.hidden = true;
  setComposerFlowLock(false);
  clearAuthOtpTimers();
  authIsVerifying = false;
  if (authOrigin === "claim") appendLoginDeclinedMessage();
  else previousAuthFocus?.focus?.({ preventScroll: true });
}

function openClaimLogin(returnFocus = document.activeElement) {
  if (!authDialog.hidden) return;
  setComposerFlowLock(true);
  showAuthDialog({ origin: "claim", returnFocus });
  appendUserMessage("確認申請");
}

function openClaimSignup(returnFocus = document.activeElement) {
  setComposerFlowLock(true);
  appendUserMessage("加入國泰產險會員");
  showAuthDialog({ origin: "signup", returnFocus });
  showSignupFlow();
}

function startAuthOtp(purpose) {
  authOtpPurpose = purpose;
  authOtpResendSeconds = 59;
  authOtpExpirySeconds = 300;
  authOtpAttemptCount = 0;
  authOtpExpired = false;
  authIsVerifying = false;
  const purposeDetails = {
    login: { view: "login-code", input: "#login-otp-input", phone: "#login-otp-phone", email: "#login-otp-email", maskedPhone: authLoginOtpPhone, maskedEmail: authLoginOtpEmail },
    signup: { view: "signup-3", input: "#signup-otp-input", phone: "#signup-otp-phone" },
    forgot: { view: "forgot-code", input: "#forgot-otp-input", phone: "#forgot-otp-phone" },
  }[purpose];
  if (!purposeDetails) return;
  if (purpose === "signup") {
    purposeDetails.maskedPhone = `${authSignupProfile.phone.slice(0, 4)}-****${authSignupProfile.phone.slice(-2)}`;
  } else if (purpose === "forgot") {
    purposeDetails.maskedPhone = `${authSignupProfile.recoveryPhone.slice(0, 4)}-****${authSignupProfile.recoveryPhone.slice(-2)}`;
  }
  document.querySelector(purposeDetails.input).value = "";
  document.querySelector(purposeDetails.phone).textContent = purposeDetails.maskedPhone;
  if (purposeDetails.email) document.querySelector(purposeDetails.email).textContent = purposeDetails.maskedEmail;
  const errorId = { login: "login-otp-error", signup: "signup-otp-error", forgot: "forgot-otp-error" }[purpose];
  setAuthOtpError(purposeDetails.input.slice(1), errorId, "");
  setAuthView(purposeDetails.view, { focus: purposeDetails.input });
  renderAuthOtpState();
  startAuthOtpTimers();
}

function authOtpControls() {
  return {
    login: { input: "#login-otp-input", error: "login-otp-error", countdown: "login-otp-countdown", resend: "login-otp-resend" },
    signup: { input: "#signup-otp-input", error: "signup-otp-error", countdown: "signup-otp-countdown", resend: "signup-otp-resend" },
    forgot: { input: "#forgot-otp-input", error: "forgot-otp-error", countdown: "forgot-otp-countdown", resend: "forgot-otp-resend" },
  }[authOtpPurpose];
}

function renderAuthOtpState() {
  if (!authOtpPurpose) return;
  const controls = authOtpControls();
  const countdown = document.getElementById(controls.countdown);
  const resend = document.getElementById(controls.resend);
  const inputElement = document.querySelector(controls.input);
  const canResend = authOtpResendSeconds <= 0 || authOtpExpired || authOtpAttemptCount >= 5;
  const formattedCountdown = authOtpPurpose === "signup"
    ? `${Math.floor(authOtpResendSeconds / 60)}:${String(authOtpResendSeconds % 60).padStart(2, "0")}`
    : authOtpPurpose === "login"
      ? `${Math.floor(authOtpResendSeconds / 60)}:${String(authOtpResendSeconds % 60).padStart(2, "0")}`
      : `${String(Math.floor(authOtpResendSeconds / 60)).padStart(2, "0")}:${String(authOtpResendSeconds % 60).padStart(2, "0")} 後可以重新發送`;
  if (authOtpPurpose === "signup") {
    countdown.hidden = canResend;
    countdown.querySelector("[data-countdown-time]").textContent = formattedCountdown;
  } else if (authOtpPurpose === "login") {
    countdown.hidden = canResend;
    countdown.querySelector("[data-countdown-time]").textContent = formattedCountdown;
  } else {
    countdown.textContent = canResend ? "" : formattedCountdown;
  }
  resend.hidden = !canResend;
  inputElement.disabled = authOtpExpired || authOtpAttemptCount >= 5 || authIsVerifying;
  updateAuthPrimary();
}

function clearAuthOtpTimers() {
  window.clearInterval(authOtpInterval);
  window.clearTimeout(authVerifyTimer);
  authOtpInterval = null;
  authVerifyTimer = null;
}

function startAuthOtpTimers() {
  clearAuthOtpTimers();
  authOtpInterval = window.setInterval(() => {
    if (authOtpResendSeconds > 0) authOtpResendSeconds -= 1;
    if (authOtpExpirySeconds > 0) authOtpExpirySeconds -= 1;
    if (authOtpExpirySeconds <= 0) {
      authOtpExpired = true;
      const controls = authOtpControls();
      setAuthOtpError(controls.input.slice(1), controls.error, authOtpPurpose === "login" ? "驗證碼已失效，請重新發送" : "動態密碼已失效，請重新發送");
    }
    renderAuthOtpState();
    if (authOtpResendSeconds <= 0 && authOtpExpirySeconds <= 0) window.clearInterval(authOtpInterval);
  }, 1000);
}

function resendAuthOtp() {
  authOtpResendSeconds = 59;
  authOtpExpirySeconds = 300;
  authOtpAttemptCount = 0;
  authOtpExpired = false;
  authIsVerifying = false;
  const controls = authOtpControls();
  document.querySelector(controls.input).value = "";
  setAuthOtpError(controls.input.slice(1), controls.error, "");
  startAuthOtpTimers();
  renderAuthOtpState();
}

function finishAuthLogin() {
  clearAuthOtpTimers();
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("auth_complete", { method: authActiveView === "login-code" ? "login_otp" : "login_password", group: usabilityGroup }, "member-auth", "會員登入");
  }
  authDialog.hidden = true;
  authReturnToLogin = false;
  const retry = beginPersonalDataConsent({ appendUser: false });
  previousPersonalDataFocus = retry;
}

function finishSignup() {
  registeredMemberIds.add(authSignupProfile.identity.toUpperCase());
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("signup_complete", { group: usabilityGroup }, "membership-registration", "會員註冊");
    window.ResearchTracker?.emit("auth_complete", { method: "signup", group: usabilityGroup }, "membership-registration", "會員註冊");
  }
  clearAuthOtpTimers();
  authDialog.hidden = true;
  authReturnToLogin = false;
  showUploadDialog("boarding-pass", previousAuthFocus);
}

function submitAuthForm(form) {
  clearAuthErrors(form);
  const value = (id) => document.getElementById(id).value.trim();
  if (form.id === "auth-password-form") {
    const identity = value("login-id").toUpperCase();
    const password = document.querySelector("#login-password").value;
    const captcha = value("login-captcha-input").toUpperCase();
    let valid = true;
    if (!isValidLoginAccount(identity)) { setAuthFieldError("login-id", "身分證號 / 居留證號格式錯誤"); valid = false; }
    if (!password) { setAuthFieldError("login-password", "請輸入密碼"); valid = false; }
    if (captcha !== authCaptchaCode) { setAuthFieldError("login-captcha-input", "驗證碼輸入錯誤"); valid = false; }
    if (!valid) return;
    if (password.trim().toLowerCase() === "wrong") {
      authPasswordAttempts += 1;
      setAuthFieldError("login-password", authPasswordAttempts >= 3
        ? "密碼錯誤達 3 次，帳號已鎖定；請點選忘記密碼重新設定，或改用驗證碼登入"
        : "帳號或密碼有誤");
      if (authPasswordAttempts >= 3) {
        authPasswordLocked = true;
        updateAuthPrimary();
      }
      return;
    }
    finishAuthLogin();
    return;
  }
  if (form.id === "auth-birthday-form") {
    const identity = value("login-code-id").toUpperCase();
    // This is a front-end prototype without a member lookup; account existence is checked by the real service.
    if (!identity) { setAuthFieldError("login-code-id", "請輸入身分證號 / 居留證號"); return; }
    if (!parseAuthBirthday(value("login-birthday"))) { setAuthFieldError("login-birthday", "請輸入正確生日，格式為西元年月日"); return; }
    startAuthOtp("login");
    return;
  }
  if (form.id === "signup-basic-form") {
    const identity = value("signup-id").toUpperCase();
    form.dataset.validationAttempted = "true";
    syncSignupNationalityField();
    const signupFieldIds = ["signup-id", ...(signupNationalityRevealed ? ["signup-nationality"] : []), "signup-birthday", "signup-name", "signup-phone", "signup-promo"];
    signupFieldIds.forEach((inputId) => setAuthFieldError(inputId, signupFieldError(inputId)));
    if (signupFieldIds.some((inputId) => signupFieldError(inputId))) { updateAuthPrimary(); return; }
    authSignupProfile = {
      identity,
      birthday: value("signup-birthday"),
      nationality: value("signup-nationality"),
      name: value("signup-name"),
      phone: value("signup-phone"),
      promo: value("signup-promo"),
    };
    authIsVerifying = true;
    form.querySelectorAll("input, select").forEach((inputElement) => { inputElement.disabled = true; });
    updateAuthPrimary();
    window.clearTimeout(authVerifyTimer);
    authVerifyTimer = window.setTimeout(() => {
      authIsVerifying = false;
      form.querySelectorAll("input, select").forEach((inputElement) => { inputElement.disabled = false; });
      if (registeredMemberIds.has(identity)) {
        setAuthFieldError("signup-id", signupFieldError("signup-id"));
        updateAuthPrimary();
        return;
      }
      setAuthView("signup-2");
    }, 650);
    return;
  }
  if (form.id === "signup-otp-form" || form.id === "login-code-form" || form.id === "forgot-code-form") {
    submitAuthOtp();
    return;
  }
  if (form.id === "forgot-phone-form") {
    const phone = value("forgot-phone");
    if (!/^09\d{8}$/.test(phone)) { setAuthFieldError("forgot-phone", "請輸入正確的手機號碼"); return; }
    authSignupProfile.recoveryPhone = phone;
    startAuthOtp("forgot");
    return;
  }
  if (form.id === "forgot-password-form") {
    const password = document.querySelector("#forgot-new-password").value;
    const confirmation = document.querySelector("#forgot-confirm-password").value;
    if (!isValidAuthPassword(password)) { setAuthFieldError("forgot-new-password", "請輸入 8-12 位英數混合密碼，且不得含連續 3 碼"); return; }
    if (password !== confirmation) { setAuthFieldError("forgot-confirm-password", "兩次輸入的密碼不一致"); return; }
    authPasswordAttempts = 0;
    authPasswordLocked = false;
    setAuthView("login-password", { focus: "#login-id" });
    const status = document.createElement("p");
    status.className = "auth-status";
    status.id = "auth-status";
    status.setAttribute("role", "status");
    status.textContent = "密碼已更新，請重新登入。";
    document.querySelector("#auth-password-form").prepend(status);
    updateAuthPrimary();
    return;
  }
  if (form.id === "signup-password-form") {
    const password = document.querySelector("#signup-password").value;
    const confirmation = document.querySelector("#signup-confirm-password").value;
    if (!isValidAuthPassword(password)) { setAuthFieldError("signup-password", "8-12位英數混合且不得為連續3碼及特殊符號"); return; }
    if (password !== confirmation) { setAuthFieldError("signup-confirm-password", "密碼不一致"); return; }
    finishSignup();
  }
}

function submitAuthOtp() {
  const controls = authOtpControls();
  const inputElement = document.querySelector(controls.input);
  const error = document.getElementById(controls.error);
  if (authIsVerifying || authOtpExpired || authOtpAttemptCount >= 5 || inputElement.value.length !== 6) return;
  authIsVerifying = true;
  error.hidden = true;
  renderAuthOtpState();
  authVerifyTimer = window.setTimeout(() => {
    authIsVerifying = false;
    if (authOtpExpired || authOtpExpirySeconds <= 0) {
      authOtpExpired = true;
      setAuthOtpError(controls.input.slice(1), controls.error, authOtpPurpose === "login" ? "驗證碼已失效，請重新發送" : "動態密碼已失效，請重新發送");
      renderAuthOtpState();
      return;
    }
    if (inputElement.value !== "123123") {
      authOtpAttemptCount += 1;
      setAuthOtpError(controls.input.slice(1), controls.error, authOtpAttemptCount >= 5 ? "輸入錯誤達 5 次，請重新發送驗證碼" : authOtpPurpose === "login" ? "驗證碼錯誤，錯誤5次將會失效" : "動態密碼輸入錯誤");
      renderAuthOtpState();
      return;
    }
    if (isUsabilityResearch && (authOtpPurpose === "login" || authOtpPurpose === "signup")) {
      window.ResearchTracker?.emit("otp_verified", { purpose: authOtpPurpose === "signup" ? "member_signup" : "member_login", group: usabilityGroup }, "member-auth", "會員驗證碼");
    }
    if (authOtpPurpose === "login") finishAuthLogin();
    else if (authOtpPurpose === "signup") {
      clearAuthOtpTimers();
      setAuthView("signup-4", { focus: "#signup-password" });
    } else {
      clearAuthOtpTimers();
      setAuthView("forgot-password", { focus: "#forgot-new-password" });
    }
  }, 550);
}

function appendOtherClaimReply() {
  const reply = document.createElement("div");
  const paragraph = document.createElement("p");
  paragraph.textContent = "阿發目前可以幫你辦理班機延誤理賠，如需處理其他項目，可以前往網頁操作。";
  const link = document.createElement("a");
  link.className = "chat-link";
  link.textContent = "前往產險理賠頁";
  link.href = generalClaimUrl;
  link.target = "_blank";
  link.rel = "noopener";
  reply.append(paragraph, link);
  appendAssistantMessage(reply);
}

function appendOutOfScopeReply() {
  const content = document.createElement("div");
  const first = document.createElement("p");
  first.textContent = "哇！你是想問怎麼樣才能寫出完美的使用手冊嗎？還是你想找什麼產品的使用手冊呀？🤔";
  const second = document.createElement("p");
  second.textContent = "阿發我主要是處理國泰產險班機延誤相關的問題啦，這個可能不在我的服務範圍喔～";
  content.append(first, second);
  appendAssistantMessage(content);
}

function appendConsultationReply() {
  const content = document.createElement("div");
  const p1 = document.createElement("p");
  p1.textContent = "班機延誤 4 小時以上，就有機會申請理賠喔。✈️";
  const p2 = document.createElement("p");
  p2.textContent = "延誤時間會從「原訂起飛時間」開始計算，到實際搭乘的班機起飛為止。";
  const p3 = document.createElement("p");
  p3.textContent = "例如：原訂 10:00 起飛，實際 14:00 起飛 → 延誤滿 4 小時，可能符合班機延誤保障。";
  content.append(p1, p2, p3);
  appendAssistantMessage(content);
}

function appendTimeoutReply() {
  const content = document.createElement("div");
  const p1 = document.createElement("p");
  p1.textContent = "不好意思，久未得到你的回覆，本次服務已結束。";
  const p2 = document.createElement("p");
  p2.textContent = "如還有班機延誤理賠申請相關問題，請點選下方連結，我就會再次出現！";
  const restart = document.createElement("button");
  restart.type = "button";
  restart.className = "chat-inline-action";
  restart.textContent = "重啟對話";
  restart.dataset.chatAction = "restart-chat";
  content.append(p1, p2, restart);
  appendAssistantMessage(content);
}

function normalizeChatIntentText(message) {
  return message.normalize("NFKC").toLowerCase().replace(/[\s，。、！!？?；;：「」『』“”‘’（）()]/g, "");
}

function isFlightDelayClaimApplicationIntent(message) {
  const text = normalizeChatIntentText(message);
  const hasDelay = /延誤|延遲|delay/.test(text);
  const hasFlight = /班機|航班|航機|flight/.test(text);
  const hasClaim = /理賠|賠償|索賠|claim/.test(text);
  const hasApplicationAction = /申請|申辦|辦理|申領|apply|fileclaim/.test(text);
  return (hasDelay && hasClaim) || (hasFlight && hasDelay && hasApplicationAction);
}

function isGenericApplicationRequest(message) {
  const text = normalizeChatIntentText(message);
  return /申請|申辦|辦理|申領|apply|fileclaim/.test(text);
}

function replyTo(message) {
  const text = message.trim();
  if (/模擬逾時|久未回覆|服務已結束/.test(text)) {
    appendTimeoutReply();
    return;
  }
  if (/旅遊平(?:安)?險|其他理賠|其他項目/.test(text)) {
    appendOtherClaimReply();
    return;
  }
  if (isFlightDelayClaimApplicationIntent(text)) {
    appendClaimDetails();
    return;
  }
  if (/使用手冊|服務範圍|非服務|天氣|股價/.test(text)) {
    appendOutOfScopeReply();
    return;
  }
  if (isGenericApplicationRequest(text)) {
    appendClaimDetails();
    return;
  }
  if (/班機|航班|延誤|理賠/.test(text)) {
    appendConsultationReply();
    return;
  }
  appendAssistantMessage("我目前是班機延誤服務的互動預覽。可以問我延誤理賠，或輸入「我想申請班機延誤的理賠」體驗申請說明。");
}

function showPolicy(title) {
  previousPolicyFocus = document.activeElement;
  policyTitle.textContent = title;
  policyCopy.replaceChildren();
  const list = document.createElement("ol");
  list.className = "policy-list";
  policyParagraphs.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });
  policyCopy.append(list);
  policyDialog.hidden = false;
  policyDialog.querySelector(".dialog-x").focus();
}

function closePolicy() {
  if (policyDialog.hidden) return;
  policyDialog.hidden = true;
  previousPolicyFocus?.focus();
}

function updatePersonalDataScrollState() {
  const reachedBottom = personalDataCopy.scrollTop + personalDataCopy.clientHeight >= personalDataCopy.scrollHeight - 4;
  personalDataAgree.disabled = !reachedBottom;
  scrollToAgree.hidden = reachedBottom;
}

function showPersonalDataNotice() {
  previousPersonalDataFocus = document.activeElement;
  personalDataCopy.replaceChildren();
  personalDataParagraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    personalDataCopy.append(paragraph);
  });
  personalDataCopy.scrollTop = 0;
  personalDataAgree.disabled = true;
  scrollToAgree.hidden = false;
  personalDataDialog.hidden = false;
  personalDataDialog.querySelector(".dialog-x").focus();
  requestAnimationFrame(updatePersonalDataScrollState);
}

function appendConsentMessage(text) {
  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = text;
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "chat-inline-action";
  retry.textContent = "返回查看個資聲明";
  retry.dataset.chatAction = "return-personal-data";
  content.append(message, retry);
  appendAssistantMessage(content);
  retry.focus({ preventScroll: true });
  return retry;
}

function appendConsentDeclinedMessage() {
  appendConsentMessage("沒有點擊同意個資聲明，不能申請班機延誤理賠喔。");
}

function closePersonalDataNotice({ agreed = false } = {}) {
  if (personalDataDialog.hidden) return;
  personalDataDialog.hidden = true;
  if (agreed) {
    previousPersonalDataFocus?.focus?.({ preventScroll: true });
    showUploadDialog();
    return;
  }
  appendConsentDeclinedMessage();
}

function setUploadNotes(lines) {
  uploadNotes.replaceChildren(...lines.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function renderUploadFileItems() {
  uploadFileList.replaceChildren();
  const files = uploadMode === "delay-proof"
    ? selectedDelayProofFiles
    : selectedBoardingPass ? [{ id: "boarding-pass", name: selectedBoardingPass.name }] : [];

  files.forEach((file) => {
    const row = document.createElement("div");
    row.className = `upload-file-item${file.error ? " has-error" : ""}`;
    row.dataset.uploadFileId = file.id;
    const main = document.createElement("div");
    main.className = "upload-file-main";
    const name = document.createElement("span");
    name.className = "upload-file-name";
    name.textContent = file.name;
    const remove = document.createElement("button");
    remove.className = "upload-file-remove";
    remove.type = "button";
    remove.dataset.removeUploadFile = file.id;
    remove.setAttribute("aria-label", `移除 ${file.name}`);
    const icon = document.createElement("img");
    icon.src = "assets/file-delete.svg";
    icon.alt = "";
    remove.append(icon);
    main.append(name, remove);
    row.append(main);
    if (file.error) {
      const helper = document.createElement("p");
      helper.className = "upload-file-helper";
      helper.textContent = file.error;
      row.append(helper);
    }
    uploadFileList.append(row);
  });
}

function updateDelayProofControls() {
  const isUploading = selectedDelayProofFiles.some((file) => file.status === "uploading");
  uploadDropzone.hidden = selectedDelayProofFiles.length >= 3;
  uploadConfirm.disabled = !selectedDelayProofFiles.length
    || isUploading
    || selectedDelayProofFiles.some((file) => file.error);
  uploadConfirm.textContent = isUploading ? "上傳中，請稍後" : "確認上傳";
}

function showUploadDialog(mode = "boarding-pass", returnFocus = document.activeElement) {
  uploadMode = mode;
  filePickerTarget = "upload";
  previousUploadFocus = returnFocus;
  uploadSourceMenu.hidden = true;
  filePickerScreen.hidden = true;
  uploadLoading.hidden = true;
  window.clearTimeout(uploadTimer);
  selectedBoardingPass = null;
  selectedDelayProofFiles = [];
  networkErrorShown = false;
  uploadFileInput.value = "";
  uploadFileInput.multiple = mode === "delay-proof";
  uploadFileInput.accept = mode === "delay-proof"
    ? ".jpg,.jpeg,.png,.heic,.pdf,image/jpeg,image/png,image/heic,application/pdf"
    : ".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic";
  uploadFileInput.setAttribute("aria-label", mode === "delay-proof" ? "選擇班機延誤證明檔案" : "選擇登機證檔案");
  uploadFileInput.removeAttribute("capture");
  uploadTitle.textContent = mode === "delay-proof" ? "班機延誤證明上傳" : "登機證上傳";
  uploadDialog.querySelector(".upload-scrim").setAttribute("aria-label", mode === "delay-proof" ? "關閉班機延誤證明上傳" : "關閉登機證上傳");
  uploadDropLabel.textContent = mode === "delay-proof" ? "點擊上傳班機延誤證明" : "點擊上傳登機證";
  uploadHelpWrap.hidden = mode !== "delay-proof";
  uploadHelpCopy.hidden = true;
  uploadHelpTrigger.setAttribute("aria-expanded", "false");
  setUploadNotes(mode === "delay-proof"
    ? ["支援 JPG、JPEG、PNG、HEIC、PDF，單檔上限 10 MB", "最多上傳 3 張班機延誤證明"]
    : ["支援 JPG、JPEG、PNG、HEIC，單檔上限 10 MB", "如有 2 張（含）以上登機證或多段航班皆延誤，產險官網或線下通路(包含臨櫃及郵寄)申請"]);
  uploadSourceMenu.querySelector("[role='dialog']").setAttribute("aria-label", mode === "delay-proof" ? "選擇班機延誤證明來源" : "選擇登機證來源");
  uploadDropzone.hidden = false;
  uploadFileList.replaceChildren();
  uploadError.hidden = true;
  uploadError.textContent = "";
  uploadConfirm.textContent = "確認上傳";
  uploadConfirm.disabled = true;
  uploadDialog.hidden = false;
  uploadDialog.querySelector(".dialog-x").focus();
}

function closeUploadDialog({ restoreFocus = true, showNoProof = true } = {}) {
  if (uploadDialog.hidden) return;
  const hasReadyProof = selectedDelayProofFiles.some((file) => !file.error && file.status === "ready");
  const shouldShowNoProof = showNoProof && uploadMode === "delay-proof" && !hasReadyProof;
  window.clearTimeout(uploadTimer);
  uploadLoading.hidden = true;
  uploadSourceMenu.hidden = true;
  filePickerScreen.hidden = true;
  uploadDialog.hidden = true;
  if (restoreFocus) {
    if (previousUploadFocus?.isConnected && !previousUploadFocus.closest("[hidden]")) previousUploadFocus.focus?.({ preventScroll: true });
    else input.focus({ preventScroll: true });
  }
  if (shouldShowNoProof) appendNoDelayProofMessage();
}

function showUploadSourceMenu() {
  uploadSourceMenu.hidden = false;
  uploadSourceMenu.querySelector('[data-upload-source="photos"]').focus();
}

function hideUploadSourceMenu() {
  uploadSourceMenu.hidden = true;
  uploadDropzone.focus({ preventScroll: true });
}

function showFilePicker(target = "upload") {
  filePickerTarget = target;
  uploadSourceMenu.hidden = true;
  filePickerSearch.value = "";
  const boardingPassRow = filePickerList.querySelector("[data-research-boarding-pass]");
  const electronicPass = isUsabilityResearch && usabilityGroup === "B";
  if (boardingPassRow) {
    boardingPassRow.dataset.sampleFile = electronicPass ? "electronic-boarding-pass" : "paper-boarding-pass";
    boardingPassRow.querySelector(".file-picker-name").textContent = electronicPass ? "電子登機證 QR Code.png" : "登機證.png";
  }
  filePickerList.querySelectorAll(".file-picker-row").forEach((row) => { row.hidden = false; });
  filePickerList.querySelectorAll(".file-picker-group").forEach((group) => { group.hidden = false; });
  if (isUsabilityResearch) {
    filePickerList.querySelectorAll('[data-file-group="file-validation"], [data-file-group="upload-outcomes"], [data-file-group="data-lookup"]')
      .forEach((group) => { group.hidden = true; });
  }
  filePickerScreen.hidden = false;
  filePickerScreen.querySelector("[data-close-picker]").focus();
}

function hideFilePicker() {
  filePickerScreen.hidden = true;
  const target = filePickerTarget === "bankbook"
    ? (bankbookSelected.hidden ? bankbookDropzone : bankbookRemove)
    : uploadDropzone;
  target.focus({ preventScroll: true });
}

function showUploadHelp() {
  if (!uploadHelpCopy.hidden) {
    hideUploadHelp();
    return;
  }
  uploadHelpCopy.hidden = false;
  positionUploadHelp();
  uploadHelpTrigger.setAttribute("aria-expanded", "true");
}

function hideUploadHelp({ restoreFocus = false } = {}) {
  uploadHelpCopy.hidden = true;
  uploadHelpTrigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) uploadHelpTrigger.focus({ preventScroll: true });
}

function positionUploadHelp() {
  const iconRect = uploadHelpTrigger.querySelector("img").getBoundingClientRect();
  const sheetRect = uploadSheet.getBoundingClientRect();
  const tooltipRect = uploadHelpCopy.getBoundingClientRect();
  const tailCenterX = 20.5;
  const left = iconRect.left + iconRect.width / 2 - tailCenterX - sheetRect.left;
  const top = iconRect.top + iconRect.height / 2 - tooltipRect.height - sheetRect.top;
  uploadHelpCopy.style.left = `${Math.max(12, Math.min(left, sheetRect.width - tooltipRect.width - 12))}px`;
  uploadHelpCopy.style.top = `${Math.max(0, top)}px`;
}

function updateBoardingPass(file) {
  window.clearTimeout(uploadTimer);
  uploadLoading.hidden = true;
  selectedBoardingPass = null;
  uploadDropzone.hidden = false;
  uploadFileList.replaceChildren();
  uploadError.textContent = "";
  uploadError.hidden = true;
  uploadConfirm.disabled = true;
  uploadConfirm.textContent = "確認上傳";
  if (!file) return;

  const extension = file.name.split(".").pop().toLowerCase();
  if (file.size > 10 * 1024 * 1024) {
    uploadFileInput.value = "";
    uploadDropLabel.textContent = "上傳登機證";
    uploadError.textContent = "檔案大小超過 10 MB，請重新上傳。";
    uploadError.hidden = false;
    return;
  }
  if (!["jpg", "jpeg", "png", "heic"].includes(extension)) {
    uploadFileInput.value = "";
    uploadDropLabel.textContent = "上傳登機證";
    uploadError.textContent = "檔案格式錯誤，請重新上傳";
    uploadError.hidden = false;
    return;
  }

  selectedBoardingPass = file;
  renderUploadFileItems();
  uploadDropzone.hidden = true;
  uploadConfirm.disabled = false;
  uploadConfirm.textContent = "確認上傳";
}

function formatScheduledDateInput(fieldInput) {
  const selectionStart = fieldInput.selectionStart ?? fieldInput.value.length;
  const digitsBeforeCaret = fieldInput.value.slice(0, selectionStart).replace(/\D/g, "").length;
  const digits = fieldInput.value.replace(/\D/g, "").slice(0, 8);
  let formatted = digits.slice(0, 4);
  if (digits.length > 4) formatted += `/${digits.slice(4, 6)}`;
  if (digits.length > 6) formatted += `/${digits.slice(6)}`;
  fieldInput.value = formatted;
  const caretPosition = digitsBeforeCaret
    + (digits.length > 4 && digitsBeforeCaret >= 4 ? 1 : 0)
    + (digits.length > 6 && digitsBeforeCaret >= 6 ? 1 : 0);
  fieldInput.setSelectionRange(caretPosition, caretPosition);
}

function formatSignupBirthdayInput(fieldInput) {
  const selectionStart = fieldInput.selectionStart ?? fieldInput.value.length;
  const digitsBeforeCaret = fieldInput.value.slice(0, selectionStart).replace(/\D/g, "").length;
  const digits = fieldInput.value.replace(/\D/g, "").slice(0, 8);
  let formatted = digits.slice(0, 4);
  if (digits.length > 4) formatted += `/${digits.slice(4, 6)}`;
  if (digits.length > 6) formatted += `/${digits.slice(6)}`;
  fieldInput.value = formatted;
  const caretPosition = digitsBeforeCaret
    + (digits.length > 4 && digitsBeforeCaret >= 4 ? 1 : 0)
    + (digits.length > 6 && digitsBeforeCaret >= 6 ? 1 : 0);
  fieldInput.setSelectionRange(caretPosition, caretPosition);
}

function formatScheduledHourInput(fieldInput) {
  const selectionStart = fieldInput.selectionStart ?? fieldInput.value.length;
  const digitsBeforeCaret = fieldInput.value.slice(0, selectionStart).replace(/\D/g, "").length;
  const digits = fieldInput.value.replace(/\D/g, "").slice(0, 4);
  fieldInput.value = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
  const caretPosition = digitsBeforeCaret + (digits.length > 2 && digitsBeforeCaret >= 2 ? 1 : 0);
  fieldInput.setSelectionRange(caretPosition, caretPosition);
}

function isValidScheduledDate(value) {
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1 || month < 1 || month > 12) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lastDay = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  return day >= 1 && day <= lastDay;
}

function isValidScheduledHour(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  return Boolean(match);
}

function updateScheduledTimeForm() {
  const dateValue = scheduledDateInput.value.trim();
  const hourValue = scheduledHourInput.value.trim();
  const dateValid = isValidScheduledDate(dateValue);
  const hourValid = isValidScheduledHour(hourValue);
  [
    { input: scheduledDateInput, field: scheduledDateField, valid: dateValid },
    { input: scheduledHourInput, field: scheduledHourField, valid: hourValid },
  ].forEach(({ input: fieldInput, field, valid }) => {
    const showError = fieldInput.dataset.touched === "true"
      && fieldInput.value.trim().length > 0
      && !valid
      && document.activeElement !== fieldInput;
    field.classList.toggle("is-invalid", showError);
    fieldInput.setAttribute("aria-invalid", String(showError));
    field.querySelector(".scheduled-time-error").hidden = !showError;
  });
  confirmScheduledTimeButton.disabled = !dateValid || !hourValid;
}

function openScheduledTimeDialog({ reset = false } = {}) {
  if (reset) {
    scheduledTimeForm.reset();
    [scheduledDateInput, scheduledHourInput].forEach((fieldInput) => {
      delete fieldInput.dataset.touched;
      fieldInput.setAttribute("aria-invalid", "false");
    });
    scheduledFlightTime = null;
  }
  updateScheduledTimeForm();
  scheduledTimeDialog.hidden = false;
  scheduledTimeDialog.focus({ preventScroll: true });
  updateScheduledTimeForm();
}

function closeScheduledTimeDialog({ confirmed = false } = {}) {
  if (scheduledTimeDialog.hidden) return;
  scheduledTimeDialog.hidden = true;
  if (confirmed) {
    const date = scheduledDateInput.value.trim();
    const time = scheduledHourInput.value.trim();
    scheduledFlightTime = { date, time };
    appendUserMessage(`原定班機時間：${date} ${time}`);
    prepareBoardingInfoSession({ manual: true });
    const [year, month, day] = date.split("/");
    boardingInfoForm.elements.year.value = year;
    boardingInfoForm.elements.date.value = `${month}/${day}`;
    updateBoardingInfoButton();
    boardingInfoDialog.hidden = false;
    boardingInfoForm.elements.passenger.focus({ preventScroll: true });
    return;
  }

  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "沒有填寫原定班機時間，不能申請班機延誤理賠喔。";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "chat-inline-action";
  retry.textContent = "返回填寫原定班機時間";
  retry.dataset.chatAction = "return-scheduled-time";
  content.append(message, retry);
  appendAssistantMessage(content);
  retry.focus({ preventScroll: true });
}

function finishBoardingPassUpload() {
  if (!selectedBoardingPass || uploadConfirm.disabled) return;
  if (previousUploadFocus?.dataset.chatAction === "retry-boarding-pass") {
    disableChatActions(previousUploadFocus);
  }
  if (selectedBoardingPass.outcome === "no-data") {
    closeUploadDialog({ restoreFocus: false, showNoProof: false });
    appendUserMessage("上傳成功");
    appendAssistantMessage("好的，請填寫原定航班的日期與時間。");
    openScheduledTimeDialog({ reset: true });
    return;
  }
  if (selectedBoardingPass.outcome === "not-boarding-pass") {
    closeUploadDialog({ restoreFocus: false, showNoProof: false });
    appendUserMessage("確認上傳");
    const content = document.createElement("div");
    const message = document.createElement("p");
    message.textContent = "你上傳的文件經辨識非登機證，請重新確認再上傳。";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "chat-inline-action";
    retry.textContent = "重新上傳";
    retry.dataset.chatAction = "retry-boarding-pass";
    content.append(message, retry);
    appendAssistantMessage(content);
    return;
  }
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("boarding_pass_upload_completed", { file_name: selectedBoardingPass.name, recognition: selectedBoardingPass.outcome === "recognition-error" ? "failed" : "passed", group: usabilityGroup }, "boarding-pass-upload", "登機證上傳");
  }
  if (selectedBoardingPass.outcome === "recognition-error") {
    boardingPassRecognitionFailures += 1;
    closeUploadDialog({ restoreFocus: false, showNoProof: false });
    appendUserMessage("確認上傳");

    if (isUsabilityResearch && usabilityGroup === "B" && selectedBoardingPass.researchElectronicQr) {
      window.ResearchTracker?.ocrFail({ file_name: selectedBoardingPass.name, source: "electronic-boarding-pass-qr" });
    }
    const message = boardingPassRecognitionFailures < 2
      ? "你上傳的文件無法辨識，請手動輸入或重新上傳。"
      : "文件已上傳成功，但目前無法辨識內容，請改用手動輸入。";
    const actions = document.createElement("div");
    actions.className = "single-button-row boarding-recognition-actions";
    if (boardingPassRecognitionFailures < 2) {
      actions.append(makeAction("手動輸入", "manual-boarding-info"));
      actions.append(makeAction("重新上傳", "retry-boarding-pass"));
    } else {
      actions.append(makeAction("手動輸入", "manual-boarding-info"));
    }
    const { column } = appendAssistantMessage(message);
    column.append(actions);
    scrollChatToBottom();
    return;
  }

  closeUploadDialog({ restoreFocus: false });
  prepareBoardingInfoSession();
  appendUserMessage("上傳成功");
  boardingInfoDialog.hidden = false;
  boardingInfoForm.elements.passenger.focus({ preventScroll: true });
}

function readBoardingInfoSnapshot() {
  return Object.fromEntries(
    ["passenger", "flight", "origin", "destination", "year", "date"]
      .map((name) => [name, boardingInfoForm.elements[name].value.trim()]),
  );
}

function changedBoardingInfoFields(current, previous) {
  return Object.keys(current).filter((name) => current[name] !== previous[name]);
}

function prepareBoardingInfoSession({ manual = false } = {}) {
  boardingInfoForm.reset();
  boardingPassRecognitionFailures = 0;
  if (manual) {
    boardingInfoForm.querySelectorAll("[name]").forEach((field) => { field.value = ""; });
  }
  boardingInfoValidationAttempted = false;
  boardingInfoConfirmed = false;
  boardingInfoModificationCount = 0;
  boardingInfoHasSubstantiveEdits = false;
  boardingInfoPreviousSnapshot = null;
  airportComboboxes.forEach((field) => {
    closeAirportCombobox(field);
    const fieldInput = field.querySelector(".airport-input");
    fieldInput.dataset.selectedValue = fieldInput.value.trim();
    delete fieldInput.dataset.keepSelectionOnFocus;
  });
  boardingInfoForm.querySelectorAll("[name]").forEach((field) => setBoardingFieldError(field, ""));
  boardingInfoOriginalSnapshot = manual ? null : readBoardingInfoSnapshot();
  if (boardingInfoOriginalSnapshot) {
    boardingInfoPreviousSnapshot = { ...boardingInfoOriginalSnapshot };
  }
  updateBoardingInfoButton();
}

function continueAfterBoardingInfo() {
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("boarding_info_confirmed", { source: boardingInfoOriginalSnapshot ? "recognized" : "manual", group: usabilityGroup }, "boarding-info", "確認航班資料");
  }
  boardingInfoConfirmed = true;
  updateBoardingInfoButton();
  airportComboboxes.forEach((field) => closeAirportCombobox(field));
  boardingInfoDialog.hidden = true;
  showUploadDialog("delay-proof", input);
}

function continueToBankInfo() {
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("boarding_info_confirmed", { source: boardingInfoOriginalSnapshot ? "recognized" : "manual", group: usabilityGroup }, "boarding-info", "確認航班資料");
  }
  boardingInfoConfirmed = true;
  updateBoardingInfoButton();
  airportComboboxes.forEach((field) => closeAirportCombobox(field));
  boardingInfoDialog.hidden = true;
  bankInfoClosePromptRetry = false;
  openBankInfoDialog();
}

function appendBankInfoPrompt({ retry = true } = {}) {
  const content = document.createElement("div");
  const message = document.createElement("p");
  const fillBankInfo = document.createElement("button");
  message.textContent = retry ? "請完成填寫匯款帳戶資料。" : "航班資料已確認，請填寫匯款帳戶資料。";
  fillBankInfo.type = "button";
  fillBankInfo.className = "chat-inline-action";
  fillBankInfo.textContent = retry ? "返回填寫匯款資料" : "填寫匯款資料";
  fillBankInfo.dataset.chatAction = "fill-bank-info";
  content.append(message, fillBankInfo);
  appendAssistantMessage(content);
  return fillBankInfo;
}

function showBoardingInfoReview(snapshot, { modified = false } = {}) {
  const card = document.createElement("div");
  const heading = document.createElement("p");
  heading.className = "boarding-info-card-heading";
  heading.textContent = "登機證資訊";

  const fields = document.createElement("div");
  fields.className = "boarding-info-card-fields";
  const addField = (label, value) => {
    const field = document.createElement("div");
    field.className = "boarding-info-card-field";
    const fieldLabel = document.createElement("p");
    fieldLabel.className = "boarding-info-card-label";
    fieldLabel.textContent = label;
    let fieldValue;
    if (label === "出發地 / 目的地") {
      fieldValue = document.createElement("div");
      fieldValue.className = "boarding-info-card-route-values";
      [snapshot.origin, "→", snapshot.destination].forEach((part, index) => {
        const item = document.createElement("span");
        item.textContent = part;
        if (index === 1) item.className = "boarding-info-card-route-arrow";
        fieldValue.append(item);
      });
    } else {
      fieldValue = document.createElement("p");
      fieldValue.className = "boarding-info-card-value";
      fieldValue.textContent = value;
    }
    field.append(fieldLabel, fieldValue);
    fields.append(field);
  };
  addField("乘客姓名", snapshot.passenger);
  addField("航班編號", snapshot.flight);
  addField("出發地 / 目的地", "");
  addField("航班起飛日期", `${snapshot.year}/${snapshot.date}`);

  const actions = document.createElement("div");
  actions.className = "info-confirm-actions";
  actions.append(
    makeAction("確認送出", "confirm-boarding-info", { primary: true }),
    makeAction("資料有誤", "edit-boarding-info"),
  );
  card.append(heading, fields, actions);
  appendAssistantSequence([
    { content: modified ? "請確認下列修改後的資訊是否正確？" : "已收到你上傳的登機證，請確認下列資訊是否正確?" },
    { content: card, card: true, className: "info-confirm-card boarding-info-card" },
  ]);
}

function addDelayProofFiles(files) {
  const incoming = [...files];
  if (!incoming.length) return;
  const availableSlots = Math.max(0, 3 - selectedDelayProofFiles.length);
  const acceptedFiles = incoming.slice(0, availableSlots);
  uploadError.hidden = true;
  uploadError.textContent = "";

  acceptedFiles.forEach((file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    const entry = {
      id: `proof-${++uploadFileSequence}`,
      file,
      name: file.name,
      size: file.size,
      outcome: file.outcome ?? null,
      status: "ready",
      error: "",
    };
    if (file.size > 10 * 1024 * 1024) {
      entry.error = "檔案大小超過 10 MB，請刪除後重新上傳。";
    } else if (!["jpg", "jpeg", "png", "heic", "pdf"].includes(extension)) {
      entry.error = "此檔案格式不支援，請刪除後重新上傳。";
    }
    selectedDelayProofFiles.push(entry);
  });

  if (incoming.length > acceptedFiles.length) {
    uploadError.textContent = "最多上傳 3 張班機延誤證明。";
    uploadError.hidden = false;
  }
  renderUploadFileItems();
  updateDelayProofControls();
  uploadFileInput.value = "";
}

function appendNoDelayProofMessage() {
  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "沒有上傳班機延誤證明，不能申請班機延誤理賠喔。";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "chat-inline-action";
  retry.textContent = "返回上傳班機延誤證明";
  retry.dataset.chatAction = "retry-delay-proof";
  content.append(message, retry);
  appendAssistantMessage(content);
  retry.focus({ preventScroll: true });
}

function appendDelayProofOutcome(outcome) {
  const content = document.createElement("div");
  const message = document.createElement("p");
  if (outcome === "recognition-error") {
    message.textContent = "你上傳的文件經辨識非航班班機延誤證明，請重新確認再上傳。";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "chat-inline-action";
    retry.textContent = "重新上傳";
    retry.dataset.chatAction = "retry-delay-proof";
    content.append(message, retry);
  } else if (outcome === "system-error") {
    message.textContent = "系統出現異常，建議你可以到會員中心使用理賠申請服務。";
    content.append(message, makeAction("前往會員中心", "claim-member"));
  } else {
    message.textContent = "班機延誤證明已上傳完成，接下來請填寫匯款資料。";
    content.append(message);
  }
  appendAssistantMessage(content);
}

function finishDelayProofUpload() {
  if (uploadConfirm.disabled || !selectedDelayProofFiles.length) return;
  uploadError.hidden = true;
  const outcomes = selectedDelayProofFiles.map((file) => file.outcome);
  const outcome = outcomes.includes("system-error")
    ? "system-error"
    : outcomes.includes("recognition-error")
      ? "recognition-error"
      : outcomes.includes("network-error") ? "network-error" : "success";

  if (outcome === "network-error" && !networkErrorShown) {
    networkErrorShown = true;
    uploadError.textContent = "網路連線異常，請重新上傳。";
    uploadError.hidden = false;
    return;
  }

  closeUploadDialog({ restoreFocus: false, showNoProof: false });
  appendUserMessage("上傳班機延誤證明");
  const finalOutcome = outcome === "network-error" ? "success" : outcome;
  if (isUsabilityResearch && finalOutcome === "success") {
    window.ResearchTracker?.emit("delay_proof_uploaded", { file_count: selectedDelayProofFiles.filter((file) => !file.error).length, group: usabilityGroup }, "delay-proof-upload", "延誤證明上傳");
  }
  appendDelayProofOutcome(finalOutcome);
  if (finalOutcome === "success") openBankInfoDialog();
}

function startUploadSubmission() {
  if (uploadConfirm.disabled) return;
  window.ResearchTracker?.uploadAttempt({
    document_type: uploadMode,
    file_names: uploadMode === "delay-proof"
      ? selectedDelayProofFiles.filter((file) => !file.error).map((file) => file.name)
      : selectedBoardingPass ? [selectedBoardingPass.name] : [],
  });
  window.clearTimeout(uploadTimer);
  uploadConfirm.disabled = true;
  uploadConfirm.textContent = "上傳中，請稍後";
  uploadLoading.hidden = false;

  if (uploadMode === "delay-proof") {
    selectedDelayProofFiles.forEach((file) => {
      if (!file.error) file.status = "uploading";
    });
    renderUploadFileItems();
    updateDelayProofControls();
  }

  uploadTimer = window.setTimeout(() => {
    uploadLoading.hidden = true;
    if (uploadMode === "delay-proof") {
      selectedDelayProofFiles.forEach((file) => {
        if (file.status === "uploading") file.status = "ready";
      });
      renderUploadFileItems();
      updateDelayProofControls();
      finishDelayProofUpload();
      return;
    }

    uploadConfirm.disabled = false;
    uploadConfirm.textContent = "確認上傳";
    finishBoardingPassUpload();
  }, uploadLoadingDurationMs);
}

function updateBankInfoButton() {
  const { bank, branch, account } = bankInfoForm.elements;
  const accountIsValid = /^\d{8,14}$/.test(account.value.trim());
  const menuIsOpen = bankCombobox.classList.contains("is-open") || branchCombobox.classList.contains("is-open");
  confirmBankInfoButton.disabled = menuIsOpen || !(bank.value && branch.value && accountIsValid);
}

function validateBankAccount() {
  const account = bankInfoForm.elements.account.value.trim();
  const isInvalid = Boolean(account) && !/^\d{8,14}$/.test(account);
  bankAccountError.hidden = !isInvalid;
  bankAccountField.classList.toggle("is-invalid", isInvalid);
  bankInfoForm.elements.account.setAttribute("aria-invalid", String(isInvalid));
  return !isInvalid;
}

function updateBankBranches(selectedBranch = "") {
  const { bank, branch } = bankInfoForm.elements;
  const bankRecord = bankDirectoryByCode.get(bank.value);
  const emptyOption = branchComboboxResults.querySelector(".airport-empty");
  branchComboboxResults.replaceChildren(emptyOption);
  branch.value = "";
  branchComboboxInput.value = "";
  branchComboboxInput.dataset.selectedLabel = "";
  branchComboboxInput.disabled = !bankRecord;
  branchComboboxInput.placeholder = "請搜尋分行別";
  branchComboboxInput.setAttribute("aria-expanded", "false");
  branchComboboxInput.removeAttribute("aria-activedescendant");
  branchCombobox.classList.remove("is-open");
  branchComboboxResults.hidden = true;
  branchCombobox.querySelector(".airport-state-icon img").src = "assets/Direction=down.svg";

  (bankRecord?.branches ?? []).forEach(([code, name, address]) => {
    const option = document.createElement("button");
    option.className = "airport-option";
    option.type = "button";
    option.id = `branch-option-${code}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.branchOption = "";
    option.dataset.value = code;
    option.dataset.label = name;
    option.dataset.search = `${code} ${name} ${address}`;
    option.textContent = name;
    branchComboboxResults.append(option);
  });

  const selectedOption = [...branchCombobox.querySelectorAll("[data-branch-option]")]
    .find((option) => option.dataset.value === selectedBranch || option.dataset.label === selectedBranch);
  if (selectedOption) {
    branch.value = selectedOption.dataset.value;
    branchComboboxInput.value = selectedOption.dataset.label;
    branchComboboxInput.dataset.selectedLabel = selectedOption.dataset.label;
  }
  updateBankInfoButton();
}

function renderBankOptions() {
  bankCombobox.querySelectorAll("[data-bank-option]").forEach((option) => option.remove());
  taiwanBankDirectory.forEach((bank) => {
    const option = document.createElement("button");
    const displayName = bank.code === "700" ? "中華郵政" : bank.name;
    option.className = "airport-option";
    option.type = "button";
    option.id = `bank-option-${bank.code}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.bankOption = "";
    option.dataset.value = bank.code;
    option.dataset.search = `${bank.name} ${bankSearchAliases[bank.code] ?? ""}`;
    option.textContent = `${bank.code} ${displayName}`;
    bankComboboxResults.append(option);
  });
}

function setBankSelection(value) {
  const option = bankCombobox.querySelector(`[data-bank-option][data-value="${value}"]`);
  const bank = bankInfoForm.elements.bank;
  bank.value = option?.dataset.value ?? "";
  bankComboboxInput.value = option?.textContent.trim() ?? "";
  bankComboboxInput.dataset.selectedLabel = bankComboboxInput.value;
}

function closeBankCombobox({ restoreSelection = true } = {}) {
  if (!bankCombobox.classList.contains("is-open")) return;
  const icon = bankCombobox.querySelector(".airport-state-icon img");
  if (restoreSelection) bankComboboxInput.value = bankComboboxInput.dataset.selectedLabel ?? "";
  bankComboboxInput.placeholder = bankInfoForm.elements.bank.value ? "" : "請搜尋匯款銀行";
  bankComboboxInput.setCustomValidity("");
  bankComboboxInput.setAttribute("aria-expanded", "false");
  bankComboboxInput.removeAttribute("aria-activedescendant");
  bankComboboxResults.hidden = true;
  bankCombobox.classList.remove("is-open");
  icon.src = "assets/Direction=down.svg";
  updateBankInfoButton();
}

function filterBankOptions() {
  const query = bankComboboxInput.value.trim().toLocaleLowerCase("zh-Hant");
  const options = [...bankCombobox.querySelectorAll("[data-bank-option]")];
  const matches = options.filter((option) => {
    const searchableText = `${option.dataset.value} ${option.dataset.search} ${option.textContent}`.toLocaleLowerCase("zh-Hant");
    const isMatch = searchableText.includes(query);
    option.hidden = !isMatch;
    option.classList.remove("is-active");
    option.setAttribute("aria-selected", "false");
    return isMatch;
  });
  bankCombobox.querySelector(".airport-empty").hidden = matches.length > 0;
  bankCombobox.dataset.activeIndex = matches.length ? "0" : "-1";
  if (matches[0]) {
    matches[0].classList.add("is-active");
    bankComboboxInput.setAttribute("aria-activedescendant", matches[0].id);
  } else {
    bankComboboxInput.removeAttribute("aria-activedescendant");
  }
}

function openBankCombobox() {
  if (bankCombobox.classList.contains("is-open")) return;
  closeBranchCombobox();
  bankComboboxInput.value = "";
  bankComboboxInput.placeholder = "請搜尋匯款銀行";
  bankComboboxInput.setCustomValidity("請從搜尋結果中選擇銀行。");
  bankComboboxInput.setAttribute("aria-expanded", "true");
  bankCombobox.classList.add("is-open");
  bankComboboxResults.hidden = false;
  bankCombobox.querySelector(".airport-state-icon img").src = "assets/airport-search.svg";
  filterBankOptions();
}

function chooseBankOption(option) {
  if (!option) return;
  setBankSelection(option.dataset.value);
  closeBankCombobox({ restoreSelection: false });
  updateBankBranches();
  bankComboboxInput.dispatchEvent(new Event("change", { bubbles: true }));
}

function moveBankActiveOption(direction) {
  const visibleOptions = [...bankCombobox.querySelectorAll("[data-bank-option]")].filter((option) => !option.hidden);
  if (!visibleOptions.length) return;
  const currentIndex = Number(bankCombobox.dataset.activeIndex ?? -1);
  const nextIndex = (currentIndex + direction + visibleOptions.length) % visibleOptions.length;
  visibleOptions.forEach((option, index) => {
    const active = index === nextIndex;
    option.classList.toggle("is-active", active);
    option.setAttribute("aria-selected", String(active));
  });
  bankCombobox.dataset.activeIndex = String(nextIndex);
  bankComboboxInput.setAttribute("aria-activedescendant", visibleOptions[nextIndex].id);
  visibleOptions[nextIndex].scrollIntoView({ block: "nearest" });
}

function closeBranchCombobox({ restoreSelection = true } = {}) {
  if (!branchCombobox.classList.contains("is-open")) return;
  if (restoreSelection) branchComboboxInput.value = branchComboboxInput.dataset.selectedLabel ?? "";
  branchComboboxInput.placeholder = "請搜尋分行別";
  branchComboboxInput.setCustomValidity("");
  branchComboboxInput.setAttribute("aria-expanded", "false");
  branchComboboxInput.removeAttribute("aria-activedescendant");
  branchComboboxResults.hidden = true;
  branchCombobox.classList.remove("is-open");
  branchCombobox.querySelector(".airport-state-icon img").src = "assets/Direction=down.svg";
  updateBankInfoButton();
}

function filterBranchOptions() {
  const query = branchComboboxInput.value.trim().toLocaleLowerCase("zh-Hant");
  const options = [...branchCombobox.querySelectorAll("[data-branch-option]")];
  const matches = options.filter((option) => {
    const searchableText = `${option.dataset.search} ${option.textContent}`.toLocaleLowerCase("zh-Hant");
    const isMatch = searchableText.includes(query);
    option.hidden = !isMatch;
    option.classList.remove("is-active");
    option.setAttribute("aria-selected", "false");
    return isMatch;
  });
  const empty = branchComboboxResults.querySelector(".airport-empty");
  empty.hidden = matches.length > 0;
  branchCombobox.dataset.activeIndex = matches.length ? "0" : "-1";
  if (matches[0]) {
    matches[0].classList.add("is-active");
    branchComboboxInput.setAttribute("aria-activedescendant", matches[0].id);
  } else {
    branchComboboxInput.removeAttribute("aria-activedescendant");
  }
}

function openBranchCombobox() {
  if (branchComboboxInput.disabled || branchCombobox.classList.contains("is-open")) return;
  closeBankCombobox();
  branchComboboxInput.value = "";
  branchComboboxInput.placeholder = "請搜尋分行別";
  branchComboboxInput.setCustomValidity("請從搜尋結果中選擇分行別。");
  branchComboboxInput.setAttribute("aria-expanded", "true");
  branchCombobox.classList.add("is-open");
  branchComboboxResults.hidden = false;
  branchCombobox.querySelector(".airport-state-icon img").src = "assets/airport-search.svg";
  filterBranchOptions();
  updateBankInfoButton();
}

function chooseBranchOption(option) {
  if (!option) return;
  bankInfoForm.elements.branch.value = option.dataset.value;
  branchComboboxInput.value = option.dataset.label;
  branchComboboxInput.dataset.selectedLabel = option.dataset.label;
  closeBranchCombobox({ restoreSelection: false });
  branchComboboxInput.dispatchEvent(new Event("change", { bubbles: true }));
}

function moveBranchActiveOption(direction) {
  const visibleOptions = [...branchCombobox.querySelectorAll("[data-branch-option]")].filter((option) => !option.hidden);
  if (!visibleOptions.length) return;
  const currentIndex = Number(branchCombobox.dataset.activeIndex ?? -1);
  const nextIndex = (currentIndex + direction + visibleOptions.length) % visibleOptions.length;
  visibleOptions.forEach((option, index) => {
    const active = index === nextIndex;
    option.classList.toggle("is-active", active);
    option.setAttribute("aria-selected", String(active));
  });
  branchCombobox.dataset.activeIndex = String(nextIndex);
  branchComboboxInput.setAttribute("aria-activedescendant", visibleOptions[nextIndex].id);
  visibleOptions[nextIndex].scrollIntoView({ block: "nearest" });
}

function openBankInfoDialog() {
  bankInfoDialog.hidden = false;
  requestAnimationFrame(() => bankInfoDialog.focus({ preventScroll: true }));
}

function closeBankInfoDialog({ restoreFocus = true, showPrompt = true } = {}) {
  if (bankInfoDialog.hidden) return;
  closeBankCombobox();
  closeBranchCombobox();
  bankInfoDialog.hidden = true;
  if (showPrompt) {
    const fillBankInfo = appendBankInfoPrompt({ retry: bankInfoClosePromptRetry ?? true });
    bankInfoClosePromptRetry = null;
    if (restoreFocus) fillBankInfo.focus({ preventScroll: true });
  } else if (restoreFocus) {
    bankInfoClosePromptRetry = null;
    chatScreen.querySelector('[data-chat-action="fill-bank-info"]')?.focus({ preventScroll: true });
  } else {
    bankInfoClosePromptRetry = null;
  }
}

function handleBankbookFile(file) {
  if (!file) return;
  const extension = file.name.split(".").pop().toLowerCase();
  if (file.size > 10 * 1024 * 1024) {
    bankbookFileInput.value = "";
    bankbookError.textContent = "檔案大小超過 10 MB，請重新上傳。";
    bankbookError.hidden = false;
    return;
  }
  if (!["jpg", "jpeg", "png", "heic", "pdf"].includes(extension)) {
    bankbookFileInput.value = "";
    bankbookError.textContent = "檔案格式錯誤，請重新上傳。";
    bankbookError.hidden = false;
    return;
  }

  bankbookError.hidden = true;
  bankbookError.textContent = "";
  bankbookSelectedName.textContent = file.name;
  bankbookSelected.hidden = false;
  bankbookDropzone.hidden = true;
  bankInfoLoading.hidden = false;
  window.clearTimeout(bankbookUploadTimer);
  bankbookUploadTimer = window.setTimeout(() => {
    bankInfoLoading.hidden = true;
    if (file.outcome === "network-error") {
      bankbookFileInput.value = "";
      bankbookSelected.hidden = true;
      bankbookSelectedName.textContent = "";
      bankbookDropzone.hidden = false;
      bankbookError.textContent = "網路連線異常，請重新上傳。";
      bankbookError.hidden = false;
      return;
    }
    setBankSelection("013");
    updateBankBranches("新竹分行");
    bankInfoForm.elements.account.value = "0001907088923";
    validateBankAccount();
    updateBankInfoButton();
  }, uploadLoadingDurationMs);
}

function removeBankbookFile() {
  window.clearTimeout(bankbookUploadTimer);
  bankInfoLoading.hidden = true;
  bankbookFileInput.value = "";
  bankbookSelected.hidden = true;
  bankbookDropzone.hidden = false;
  bankbookError.hidden = true;
}

function closeAirportCombobox(field, { restoreSelection = true } = {}) {
  if (!field?.classList.contains("is-open")) return;
  const input = field.querySelector(".airport-input");
  const results = field.querySelector(".airport-results");
  const icon = field.querySelector(".airport-state-icon img");
  const previousValue = input.value;
  if (restoreSelection) input.value = input.dataset.selectedValue ?? "";
  input.setCustomValidity("");
  input.placeholder = "";
  input.setAttribute("aria-expanded", "false");
  input.removeAttribute("aria-activedescendant");
  results.hidden = true;
  field.classList.remove("is-open");
  icon.src = "assets/Direction=down.svg";
  if (restoreSelection && input.value !== previousValue) input.dispatchEvent(new Event("change", { bubbles: true }));
}

function filterAirportOptions(field) {
  const input = field.querySelector(".airport-input");
  const options = [...field.querySelectorAll("[data-airport-option]")];
  const query = input.value.trim().toLocaleLowerCase("zh-Hant");
  const matches = options.filter((option) => {
    const searchableText = `${option.dataset.value} ${option.dataset.search} ${option.textContent}`.toLocaleLowerCase("zh-Hant");
    const isMatch = searchableText.includes(query);
    option.hidden = !isMatch;
    option.classList.remove("is-active");
    option.setAttribute("aria-selected", "false");
    return isMatch;
  });
  field.querySelector(".airport-empty").hidden = matches.length > 0;
  field.dataset.activeIndex = matches.length ? "0" : "-1";
  if (matches[0]) {
    matches[0].classList.add("is-active");
    input.setAttribute("aria-activedescendant", matches[0].id);
  } else {
    input.removeAttribute("aria-activedescendant");
  }
}

function openAirportCombobox(field) {
  if (!field || field.classList.contains("is-open")) return;
  airportComboboxes.forEach((other) => closeAirportCombobox(other));
  const input = field.querySelector(".airport-input");
  const results = field.querySelector(".airport-results");
  const icon = field.querySelector(".airport-state-icon img");
  input.dataset.selectedValue ??= input.value;
  input.value = "";
  input.placeholder = "搜尋機場";
  input.setCustomValidity("請從搜尋結果中選擇機場。");
  input.setAttribute("aria-expanded", "true");
  icon.src = "assets/airport-search.svg";
  field.classList.add("is-open");
  results.hidden = false;
  filterAirportOptions(field);

  requestAnimationFrame(() => {
    const scrollArea = field.closest(".boarding-info-fields");
    const overflow = results.getBoundingClientRect().bottom - scrollArea.getBoundingClientRect().bottom + 8;
    if (overflow > 0) scrollArea.scrollBy({ top: overflow, behavior: "smooth" });
  });
}

function chooseAirport(field, option) {
  if (!option) return;
  const input = field.querySelector(".airport-input");
  const shouldRestoreFocus = document.activeElement !== input;
  input.value = option.dataset.value;
  input.dataset.selectedValue = option.dataset.value;
  input.setCustomValidity("");
  closeAirportCombobox(field, { restoreSelection: false });
  input.dispatchEvent(new Event("change", { bubbles: true }));
  if (shouldRestoreFocus) {
    input.dataset.keepSelectionOnFocus = "true";
    input.focus({ preventScroll: true });
  }
}

function moveAirportActiveOption(field, direction) {
  const input = field.querySelector(".airport-input");
  const visibleOptions = [...field.querySelectorAll("[data-airport-option]")].filter((option) => !option.hidden);
  if (!visibleOptions.length) return;
  const currentIndex = Number(field.dataset.activeIndex ?? -1);
  const nextIndex = (currentIndex + direction + visibleOptions.length) % visibleOptions.length;
  visibleOptions.forEach((option, index) => {
    const active = index === nextIndex;
    option.classList.toggle("is-active", active);
    option.setAttribute("aria-selected", String(active));
  });
  field.dataset.activeIndex = String(nextIndex);
  input.setAttribute("aria-activedescendant", visibleOptions[nextIndex].id);
  visibleOptions[nextIndex].scrollIntoView({ block: "nearest" });
}

function closeBoardingInfoDialog() {
  if (boardingInfoDialog.hidden) return;
  airportComboboxes.forEach((field) => closeAirportCombobox(field));
  boardingInfoDialog.hidden = true;
  appendUserMessage("確認申請");
  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "沒有填寫原航班的資訊，不能申請班機延誤理賠喔。";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "chat-inline-action";
  retry.textContent = "返回填寫航班資訊";
  retry.dataset.chatAction = "return-boarding-info";
  content.append(message, retry);
  appendAssistantMessage(content);
}

function selectSampleFile(type) {
  const samples = {
    pdf: { name: "班機延誤證明_超過10MB.pdf", size: 12.4 * 1024 * 1024, type: "application/pdf" },
    "docx-large": { name: "交易明細.docx", size: 12.4 * 1024 * 1024, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    zip: { name: "租屋合約.zip", size: 684 * 1024, type: "application/zip" },
    png: { name: "班機延誤證明.png", size: 1.88 * 1024 * 1024, type: "image/png" },
    "paper-boarding-pass": { name: "登機證.png", size: 1.88 * 1024 * 1024, type: "image/png" },
    "electronic-boarding-pass": { name: "電子登機證 QR Code.png", size: 1.88 * 1024 * 1024, type: "image/png", outcome: "recognition-error", researchElectronicQr: true },
    "proof-sample-pdf": { name: "延誤證明.pdf", size: 2.16 * 1024 * 1024, type: "application/pdf" },
    "aaaa-jpg": { name: "AAAA.jpg", size: 1.42 * 1024 * 1024, type: "image/jpeg" },
    "proof-pdf": { name: "延誤證明2.pdf", size: 1.24 * 1024 * 1024, type: "application/pdf" },
    "bankbook-sample": { name: "存摺.pdf", size: 1.42 * 1024 * 1024, type: "application/pdf", outcome: "not-boarding-pass" },
    "mobile-photo": { name: "手機照片.jpg", size: 20 * 1024 * 1024, type: "image/jpeg", outcome: "not-boarding-pass" },
    "not-boarding-pass": { name: "非登機證測試.jpg", size: 1.35 * 1024 * 1024, type: "image/jpeg", outcome: "not-boarding-pass" },
    "network-error": { name: "連線異常測試.png", size: 1.42 * 1024 * 1024, type: "image/png", outcome: "network-error" },
    "no-data": { name: "查無航班資料測試.jpg", size: 1.32 * 1024 * 1024, type: "image/jpeg", outcome: "no-data" },
    "recognition-error": { name: "辨識失敗測試.jpg", size: 1.36 * 1024 * 1024, type: "image/jpeg", outcome: "recognition-error" },
    "system-error": { name: "系統異常測試.png", size: 1.51 * 1024 * 1024, type: "image/png", outcome: "system-error" },
  };
  const file = samples[type];
  if (!file) return;
  if (filePickerTarget === "bankbook") {
    handleBankbookFile(file);
    hideFilePicker();
    return;
  }
  hideFilePicker();
  if (uploadMode === "delay-proof") addDelayProofFiles([file]);
  else updateBoardingPass(file);
}

function renderOtpState() {
  const canResend = otpResendSeconds <= 0 || otpAttemptCount >= 5 || otpExpired;
  otpResend.hidden = !canResend;
  otpCountdown.textContent = canResend
    ? ""
    : String(Math.floor(otpResendSeconds / 60)).padStart(2, "0") + ":" + String(otpResendSeconds % 60).padStart(2, "0") + " 後可以重新發送";
  otpNext.disabled = otpInput.value.length !== 6 || otpExpired || otpAttemptCount >= 5 || otpIsVerifying;
  otpInput.disabled = otpIsVerifying;
}

function showOtpError(message) {
  otpError.textContent = message;
  otpError.hidden = false;
  otpField.classList.add("is-invalid");
  otpInput.setAttribute("aria-invalid", "true");
  otpHelpNote.hidden = true;
  otpHelpTrigger.setAttribute("aria-expanded", "false");
}

function stopOtpTimers() {
  window.clearInterval(otpInterval);
  window.clearTimeout(otpVerifyTimer);
  otpInterval = null;
  otpVerifyTimer = null;
}

function startOtpTimers() {
  window.clearInterval(otpInterval);
  otpInterval = window.setInterval(() => {
    if (otpResendSeconds > 0) otpResendSeconds -= 1;
    if (otpExpirySeconds > 0) otpExpirySeconds -= 1;
    if (otpExpirySeconds <= 0 && !otpExpired) {
      otpExpired = true;
      showOtpError("動態密碼已失效，請重新發送");
    }
    renderOtpState();
    if (otpResendSeconds <= 0 && otpExpirySeconds <= 0) window.clearInterval(otpInterval);
  }, 1000);
}

function positionOtpTooltip(note, trigger, sheet) {
  if (note.hidden) return;
  const icon = trigger.querySelector("img");
  if (!icon || !sheet) return;

  const iconRect = icon.getBoundingClientRect();
  const sheetRect = sheet.getBoundingClientRect();
  // The usability-test embed scales the 393 x 852 preview stage. Convert
  // viewport measurements back to the sheet's CSS-pixel coordinate space
  // before assigning absolute `left` and `top` values.
  const scaleX = sheet.offsetWidth ? sheetRect.width / sheet.offsetWidth : 1;
  const scaleY = sheet.offsetHeight ? sheetRect.height / sheet.offsetHeight : 1;
  const sheetWidth = sheet.clientWidth;
  const sheetHeight = sheet.clientHeight;
  const noteWidth = note.offsetWidth;
  const noteHeight = note.offsetHeight;
  const iconCenterX = (iconRect.left + iconRect.width / 2 - sheetRect.left) / scaleX;
  const iconTop = (iconRect.top - sheetRect.top) / scaleY;
  const iconBottom = (iconRect.bottom - sheetRect.top) / scaleY;
  const arrowCenter = 20;
  const desiredLeft = iconCenterX - arrowCenter;
  const left = Math.max(12, Math.min(desiredLeft, sheetWidth - noteWidth - 12));
  const availableAbove = iconTop;
  const availableBelow = sheetHeight - iconBottom;
  const openAbove = availableAbove >= noteHeight + 12 || availableAbove >= availableBelow;
  const placement = openAbove ? "above" : "below";
  const desiredTop = openAbove
    ? iconTop - noteHeight - 12
    : iconBottom + 12;
  const top = Math.max(8, Math.min(desiredTop, sheetHeight - noteHeight - 8));
  const arrowX = iconCenterX - left;

  note.dataset.placement = placement;
  note.style.left = `${left}px`;
  note.style.top = `${top}px`;
  note.style.setProperty("--otp-help-arrow-x", `${arrowX}px`);
}

function positionOtpHelp() {
  positionOtpTooltip(otpHelpNote, otpHelpTrigger, otpDialog.querySelector(".otp-sheet"));
}

function positionLoginOtpHelp() {
  positionOtpTooltip(loginOtpHelpNote, loginOtpHelpTrigger, authSheet);
}

function openOtpDialog({ resetSession = false } = {}) {
  if (resetSession) {
    stopOtpTimers();
    otpResendSeconds = 60;
    otpExpirySeconds = 300;
    otpAttemptCount = 0;
    otpExpired = false;
    otpIsVerifying = false;
    otpInput.disabled = false;
    otpNext.textContent = "下一步";
    otpInput.value = "";
    otpInput.setAttribute("aria-invalid", "false");
    otpError.hidden = true;
    otpField.classList.remove("is-invalid");
    otpHelp.hidden = false;
    otpHelpNote.hidden = true;
    otpHelpTrigger.setAttribute("aria-expanded", "false");
  }
  otpDialog.hidden = false;
  renderOtpState();
  startOtpTimers();
  otpDialog.focus({ preventScroll: true });
}

function closeOtpDialog() {
  if (otpDialog.hidden) return;
  stopOtpTimers();
  otpDialog.hidden = true;
  otpIsVerifying = false;
  otpInput.disabled = false;
  otpNext.textContent = "下一步";
  otpHelpNote.hidden = true;
  otpHelpTrigger.setAttribute("aria-expanded", "false");
  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "尚未完成動態密碼驗證，完成驗證後即可送出匯款資料。";
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "chat-inline-action";
  retry.textContent = "繼續驗證";
  retry.addEventListener("click", () => openOtpDialog());
  content.append(message, retry);
  appendAssistantMessage(content);
}

function resendOtp() {
  otpResendSeconds = 60;
  otpExpirySeconds = 300;
  otpAttemptCount = 0;
  otpExpired = false;
  otpIsVerifying = false;
  otpInput.value = "";
  otpInput.disabled = false;
  otpNext.textContent = "下一步";
  otpInput.setAttribute("aria-invalid", "false");
  otpError.hidden = true;
  otpField.classList.remove("is-invalid");
  otpHelp.hidden = false;
  otpHelpNote.hidden = true;
  otpHelpTrigger.setAttribute("aria-expanded", "false");
  renderOtpState();
  startOtpTimers();
}

function finishOtpVerification() {
  stopOtpTimers();
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("otp_verified", { purpose: "bank_transfer", group: usabilityGroup }, "bank-transfer-otp", "匯款動態密碼驗證");
  }
  otpIsVerifying = false;
  otpInput.disabled = false;
  otpNext.textContent = "下一步";
  otpDialog.hidden = true;
  setComposerFlowLock(false);
  const result = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "已收到你的匯款資料，案件編號 00910-HAC，可以隨時在會員中心查看理賠進度。";
  const memberLink = document.createElement("a");
  memberLink.className = "otp-member-link";
  memberLink.href = memberCenterUrl;
  memberLink.target = "_blank";
  memberLink.rel = "noopener";
  memberLink.textContent = "前往會員中心";
  const externalIcon = document.createElement("img");
  externalIcon.src = "assets/external-link.svg";
  externalIcon.alt = "";
  memberLink.append(externalIcon);
  memberLink.addEventListener("click", (event) => {
    event.preventDefault();
    showOfficialConfirm("你即將離開阿發，前往國泰產險會員中心。", memberCenterUrl);
  });
  result.append(message, memberLink);

  const feedback = createExperienceFeedback();
  appendAssistantSequence([
    { content: result },
    { content: feedback, card: true, className: "message-feedback-shell" },
  ]);
}

function finishOtpApiError() {
  stopOtpTimers();
  otpIsVerifying = false;
  otpInput.disabled = false;
  otpInput.value = "";
  otpError.hidden = true;
  otpField.classList.remove("is-invalid");
  otpInput.setAttribute("aria-invalid", "false");
  otpNext.textContent = "下一步";
  otpDialog.hidden = true;
  setComposerFlowLock(false);
  otpHelpNote.hidden = true;
  otpHelpTrigger.setAttribute("aria-expanded", "false");

  const content = document.createElement("div");
  const message = document.createElement("p");
  message.textContent = "系統出現異常，建議你可以到會員中心使用理賠申請服務。";
  content.append(message, makeAction("前往會員中心", "claim-member"));
  appendAssistantMessage(content);
}

function createExperienceFeedback() {
  const card = document.createElement("div");
  card.className = "feedback-component";
  card.dataset.state = "default";
  card.setAttribute("role", "group");
  card.setAttribute("aria-label", "體驗回饋");

  const question = document.createElement("p");
  question.className = "feedback-question";
  question.textContent = "這次體驗，阿發有幫上忙嗎？";
  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "feedback-dismiss";
  dismiss.setAttribute("aria-label", "關閉回饋");
  const closeIcon = document.createElement("img");
  closeIcon.src = "assets/close.svg";
  closeIcon.alt = "";
  dismiss.append(closeIcon);

  const choices = document.createElement("div");
  choices.className = "feedback-choices";
  [
    ["很順利", "smooth"],
    ["有點卡住", "stuck"],
    ["沒幫上忙", "unhelpful"],
  ].forEach(([label, value]) => {
    const choice = document.createElement("button");
    choice.type = "button";
    choice.className = "feedback-choice";
    choice.dataset.rating = value;
    choice.setAttribute("aria-pressed", "false");
    choice.textContent = label;
    choices.append(choice);
  });

  const divider = document.createElement("div");
  divider.className = "feedback-divider";
  const reasonPanel = document.createElement("div");
  reasonPanel.className = "feedback-reason-panel";
  reasonPanel.hidden = true;
  const reasonTitle = document.createElement("p");
  reasonTitle.textContent = "最主要原因是什麼呢？";
  const reasons = document.createElement("div");
  reasons.className = "feedback-reason-options";
  ["等太久", "步驟太多", "找不到下一步", "問好幾次才懂"].forEach((label) => {
    const reason = document.createElement("button");
    reason.type = "button";
    reason.className = "feedback-reason-option";
    reason.textContent = label;
    reasons.append(reason);
  });
  reasonPanel.append(reasonTitle, reasons);
  card.append(question, dismiss, choices, divider, reasonPanel);

  dismiss.addEventListener("click", () => card.parentElement.remove());
  choices.addEventListener("click", (event) => {
    const choice = event.target.closest(".feedback-choice");
    if (!choice) return;
    choices.querySelectorAll(".feedback-choice").forEach((item) => {
      const selected = item === choice;
      item.classList.toggle("is-highlighted", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    if (choice.dataset.rating === "smooth") {
      completeExperienceFeedback(card);
      return;
    }
    card.dataset.state = "expanded";
    card.parentElement.dataset.state = "expanded";
    reasonPanel.hidden = false;
  });
  reasons.addEventListener("click", (event) => {
    if (event.target.closest(".feedback-reason-option")) completeExperienceFeedback(card);
  });
  return card;
}

function completeExperienceFeedback(card) {
  card.dataset.state = "done";
  card.parentElement.dataset.state = "done";
  const check = document.createElement("span");
  check.className = "feedback-check";
  check.setAttribute("aria-hidden", "true");
  const message = document.createElement("p");
  message.className = "feedback-done-message";
  message.textContent = "謝謝你的回饋，阿發會持續改善！";
  card.replaceChildren(check, message);
}

function showOfficialConfirm(description = "您即將離開阿發，前往產險服務條款頁。", url = officialClaimUrl) {
  confirmCopy.textContent = description;
  confirmGo.href = url;
  confirmDialog.showModal();
}

const aiDisclaimerLink = document.querySelector("#ai-disclaimer-link");
aiDisclaimerLink.addEventListener("click", (event) => {
  event.preventDefault();
  showOfficialConfirm("你即將離開阿發，前往 AI 告知聲明頁。", aiDisclaimerLink.href);
});
confirmGo.addEventListener("click", () => confirmDialog.close());

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => startChat(button.dataset.prompt));
});

input.addEventListener("input", () => {
  sendButton.disabled = input.value.trim().length === 0;
});

document.querySelector("#composer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  if (/模擬逾時|久未回覆|服務已結束/.test(message)) {
    if (chatScreen.hidden) startChat();
    else appendTimeoutReply();
  } else if (chatScreen.hidden) startChat(message);
  else {
    appendUserMessage(message);
    replyTo(message);
  }
  input.value = "";
  sendButton.disabled = true;
  input.focus();
});

document.querySelectorAll("[data-policy]").forEach((button) => {
  button.addEventListener("click", () => showPolicy(button.dataset.policy));
});
policyDialog.querySelectorAll("[data-close-policy]").forEach((button) => button.addEventListener("click", closePolicy));
signupStatementScroll.addEventListener("scroll", () => {
  const reachedBottom = signupStatementScroll.scrollTop + signupStatementScroll.clientHeight >= signupStatementScroll.scrollHeight - 2;
  if (reachedBottom && signupStatementScroll.scrollHeight > signupStatementScroll.clientHeight + 2) markSignupStatementRead();
});
authDialog.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-auth-form]");
  if (!form) return;
  event.preventDefault();
  submitAuthForm(form);
});
authPrimary.addEventListener("click", (event) => {
  if (authActiveView !== "signup-2") return;
  event.preventDefault();
  if (authPrimary.disabled) return;
  startAuthOtp("signup");
});
authDialog.addEventListener("input", (event) => {
  const inputElement = event.target;
  if (!(inputElement instanceof HTMLInputElement)) return;
  if (inputElement.id === "signup-nationality-search") {
    signupNationalityActiveValue = "";
    renderSignupNationalityOptions();
    positionSignupNationalityMenu();
    return;
  }
  if (["signup-id", "login-id", "login-code-id"].includes(inputElement.id)) inputElement.value = inputElement.value.toUpperCase();
  if (inputElement.id === "signup-id") syncSignupNationalityField();
  if (inputElement.id === "signup-birthday") formatSignupBirthdayInput(inputElement);
  if (["login-birthday", "signup-phone", "forgot-phone", "login-otp-input", "forgot-otp-input", "signup-otp-input"].includes(inputElement.id)) {
    inputElement.value = inputElement.value.replace(/\D/g, "").slice(0, inputElement.id.includes("birthday") ? 8 : 10);
  }
  const error = authDialog.querySelector(`[data-auth-error-for="${inputElement.id}"]`);
  if (error?.hidden === false) setAuthFieldError(inputElement.id, "");
  const otpErrorIds = { "login-otp-input": "login-otp-error", "forgot-otp-input": "forgot-otp-error", "signup-otp-input": "signup-otp-error" };
  if (otpErrorIds[inputElement.id]) setAuthOtpError(inputElement.id, otpErrorIds[inputElement.id], "");
  updateAuthPrimary();
});
authDialog.addEventListener("change", (event) => {
  if (event.target.id === "signup-nationality") syncSignupNationalityValue();
  if (event.target.id === "signup-nationality" && !document.querySelector("#signup-nationality-error").hidden) {
    setAuthFieldError("signup-nationality", "");
  }
  if (event.target.id === "signup-all-declarations" && event.target.checked) {
    const firstUnread = [...authDialog.querySelectorAll("input[name='declaration']")].find((checkbox) => !checkbox.checked);
    if (firstUnread) {
      event.target.checked = false;
      openSignupStatement(firstUnread.value);
      return;
    }
  } else if (event.target.matches("input[name='declaration']")) {
    if (event.target.checked && !signupStatementsRead.has(event.target.value)) {
      event.target.checked = false;
      openSignupStatement(event.target.value);
      updateAuthPrimary();
      return;
    }
    syncSignupDeclarationMaster();
  }
  updateAuthPrimary();
});
authDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !signupNationalityMenu.hidden) {
    event.preventDefault();
    event.stopPropagation();
    closeSignupNationalityMenu({ restoreFocus: true });
    return;
  }
  if (event.key === "Escape" && !signupNationalityTooltip.hidden) {
    event.preventDefault();
    event.stopPropagation();
    closeSignupNationalityTooltip({ restoreFocus: true });
    return;
  }
  if (event.target.id === "signup-nationality-trigger") {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (signupNationalityMenu.hidden) openSignupNationalityMenu();
      else signupNationalitySearch.focus({ preventScroll: true });
    }
    return;
  }
  if (event.target.id !== "signup-nationality-search" || signupNationalityMenu.hidden) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveSignupNationalityActiveOption(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveSignupNationalityActiveOption(-1);
  } else if (event.key === "Home") {
    event.preventDefault();
    moveSignupNationalityActiveOption("first");
  } else if (event.key === "End") {
    event.preventDefault();
    moveSignupNationalityActiveOption("last");
  } else if (event.key === "Enter" && signupNationalityActiveValue) {
    event.preventDefault();
    chooseSignupNationality(signupNationalityActiveValue);
  } else if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeSignupNationalityMenu({ restoreFocus: true });
  } else if (event.key === "Tab") {
    event.preventDefault();
    closeSignupNationalityMenu();
    document.querySelector(event.shiftKey ? "#signup-birthday" : "#signup-name")?.focus({ preventScroll: true });
  }
});
authDialog.addEventListener("focusout", (event) => {
  const inputId = event.target.id;
  if (inputId.startsWith("signup-") && document.querySelector("#signup-basic-form").dataset.validationAttempted === "true") {
    setAuthFieldError(inputId, signupFieldError(inputId));
  } else if (inputId === "signup-password" || inputId === "signup-confirm-password") {
    const inputValue = document.getElementById(inputId).value;
    if (inputValue) setAuthFieldError(inputId, signupFieldError(inputId));
  }
  updateAuthPrimary();
});
authDialog.addEventListener("click", (event) => {
  const nationalityOption = event.target.closest("[data-nationality-value]");
  if (nationalityOption) {
    closeSignupNationalityTooltip();
    chooseSignupNationality(nationalityOption.dataset.nationalityValue);
    return;
  }
  if (event.target.closest("#signup-nationality-trigger")) {
    closeSignupNationalityTooltip();
    if (signupNationalityMenu.hidden) openSignupNationalityMenu();
    else closeSignupNationalityMenu();
    return;
  }
  if (!signupNationalityMenu.hidden && !event.target.closest("#signup-nationality-menu, #signup-nationality-search-wrap")) closeSignupNationalityMenu();
  if (event.target.closest("#signup-nationality-help")) {
    if (signupNationalityTooltip.hidden) {
      signupNationalityTooltip.hidden = false;
      signupNationalityHelp.setAttribute("aria-expanded", "true");
      positionSignupNationalityTooltip();
    } else {
      closeSignupNationalityTooltip();
    }
    return;
  }
  if (event.target.closest("#signup-nationality-help-close")) {
    closeSignupNationalityTooltip({ restoreFocus: true });
    return;
  }
  if (!signupNationalityTooltip.hidden
    && !event.target.closest("#signup-nationality-field")
    && !event.target.closest("#signup-nationality-tooltip")) {
    closeSignupNationalityTooltip();
  }
  if (authActiveView === "login-birthday" && event.target.closest("#auth-primary")) {
    event.preventDefault();
    submitAuthForm(document.querySelector("#auth-birthday-form"));
    return;
  }
  const statementLink = event.target.closest("[data-open-signup-statement]");
  if (statementLink) { openSignupStatement(statementLink.dataset.openSignupStatement); return; }
  if (event.target.closest("#signup-statement-close")) { closeSignupStatement(); return; }
  if (event.target.closest("#signup-statement-scroll-button")) {
    const hasOverflow = signupStatementScroll.scrollHeight > signupStatementScroll.clientHeight + 2;
    signupStatementScroll.scrollTo({ top: signupStatementScroll.scrollHeight, behavior: "smooth" });
    if (!hasOverflow) markSignupStatementRead();
    return;
  }
  if (event.target.closest("#signup-statement-agree")) {
    if (signupStatementAgree.disabled) return;
    const checkbox = authDialog.querySelector(`input[name="declaration"][value="${activeSignupStatement}"]`);
    if (checkbox) checkbox.checked = true;
    closeSignupStatement({ restoreFocus: false });
    syncSignupDeclarationMaster();
    updateAuthPrimary();
    checkbox?.focus({ preventScroll: true });
    return;
  }
  const closeButton = event.target.closest("[data-close-auth]");
  if (closeButton) { closeAuthDialog(); return; }
  const tab = event.target.closest("[data-auth-tab]");
  if (tab) { setAuthView(tab.dataset.authTab, { focus: tab.dataset.authTab === "login-password" ? "#login-id" : "#login-code-id" }); return; }
  if (event.target.closest("[data-auth-register]")) { showSignupFlow({ returnToLogin: true }); return; }
  if (event.target.closest("#auth-back")) {
    if (authActiveView.startsWith("signup-")) {
      const step = Number(authActiveView.slice(-1));
      if (step > 1) {
        if (step === 4) startAuthOtpTimers();
        if (step === 3) clearAuthOtpTimers();
        const previousStep = step - 1;
        setAuthView(`signup-${previousStep}`, { focus: previousStep === 1 ? "#signup-id" : previousStep === 3 ? "#signup-otp-input" : "#auth-primary" });
      }
      else if (authReturnToLogin) {
        clearAuthOtpTimers();
        authIsVerifying = false;
        setAuthView("login-password", { focus: "#login-id" });
      }
      else closeAuthDialog();
    } else if (authActiveView === "forgot-code") {
      clearAuthOtpTimers();
      setAuthView("forgot-phone", { focus: "#forgot-phone" });
    } else if (authActiveView === "forgot-password") {
      startAuthOtpTimers();
      setAuthView("forgot-code", { focus: "#forgot-otp-input" });
    }
    else setAuthView("login-password", { focus: "#login-id" });
    return;
  }
  const passwordToggle = event.target.closest("[data-toggle-password]");
  if (passwordToggle) {
    const inputElement = document.getElementById(passwordToggle.dataset.togglePassword);
    const visible = inputElement.type === "password";
    const label = passwordToggle.dataset.toggleLabel || "密碼";
    inputElement.type = visible ? "text" : "password";
    passwordToggle.setAttribute("aria-pressed", String(visible));
    passwordToggle.setAttribute("aria-label", `${visible ? "隱藏" : "顯示"}${label}`);
    passwordToggle.querySelector("img").src = visible
      ? "assets/auth-eye-open.svg"
      : "assets/auth-eye-closed.svg";
    return;
  }
  if (event.target.closest("#auth-captcha-refresh")) {
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    authCaptchaCode = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
    const canvas = document.createElement("canvas");
    canvas.width = 116;
    canvas.height = 46;
    const context = canvas.getContext("2d");
    context.fillStyle = "#f5f5f5";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < 7; index += 1) {
      context.strokeStyle = `rgba(79, 68, 195, ${0.12 + Math.random() * 0.18})`;
      context.beginPath();
      context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.stroke();
    }
    context.font = "bold 24px sans-serif";
    context.textBaseline = "middle";
    [...authCaptchaCode].forEach((character, index) => {
      context.save();
      context.translate(12 + index * 25, 23 + (Math.random() - 0.5) * 7);
      context.rotate((Math.random() - 0.5) * 0.24);
      context.fillStyle = "#454545";
      context.fillText(character, 0, 0);
      context.restore();
    });
    const image = document.querySelector("#auth-captcha-image");
    image.classList.add("is-generated");
    image.src = canvas.toDataURL("image/png");
    image.alt = "圖形驗證碼";
    document.querySelector("#login-captcha-input").value = "";
    setAuthFieldError("login-captcha-input", "");
    updateAuthPrimary();
    return;
  }
  if (event.target.closest("#auth-captcha-audio")) {
    if ("speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance([...authCaptchaCode].join(" ")));
    return;
  }
  if (event.target.closest("#signup-otp-resend, #login-otp-resend, #forgot-otp-resend")) { resendAuthOtp(); return; }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!filePickerScreen.hidden) hideFilePicker();
  else if (!uploadSourceMenu.hidden) hideUploadSourceMenu();
  else if (!scheduledTimeDialog.hidden) closeScheduledTimeDialog();
  else if (!signupStatementDialog.hidden) closeSignupStatement();
  else if (!authDialog.hidden) closeAuthDialog();
  else if (!uploadDialog.hidden) closeUploadDialog();
  else if (!otpDialog.hidden) closeOtpDialog();
  else if (!bankInfoDialog.hidden) closeBankInfoDialog();
  else if (!boardingInfoDialog.hidden) closeBoardingInfoDialog();
  else if (!personalDataDialog.hidden) closePersonalDataNotice();
  else if (!policyDialog.hidden) closePolicy();
});
document.querySelector("#confirm-cancel").addEventListener("click", () => confirmDialog.close());
authScroll.addEventListener("scroll", () => {
  if (!signupNationalityMenu.hidden) positionSignupNationalityMenu();
  if (!signupNationalityTooltip.hidden) positionSignupNationalityTooltip();
}, { passive: true });
window.addEventListener("resize", () => {
  positionSignupNationalityMenu();
  positionSignupNationalityTooltip();
});
window.visualViewport?.addEventListener("resize", () => {
  positionSignupNationalityMenu();
  positionSignupNationalityTooltip();
});

personalDataCopy.addEventListener("scroll", updatePersonalDataScrollState, { passive: true });
scrollToAgree.addEventListener("click", () => {
  personalDataCopy.scrollTo({ top: personalDataCopy.scrollHeight, behavior: "smooth" });
});
personalDataAgree.addEventListener("click", () => {
  if (personalDataAgree.disabled) return;
  closePersonalDataNotice({ agreed: true });
});
personalDataDialog.querySelectorAll("[data-close-personal-data]").forEach((button) => {
  button.addEventListener("click", () => closePersonalDataNotice());
});

uploadDialog.querySelectorAll("[data-close-upload]").forEach((button) => {
  button.addEventListener("click", () => closeUploadDialog());
});
uploadHelpTrigger.addEventListener("click", showUploadHelp);
uploadHelpClose.addEventListener("click", () => hideUploadHelp({ restoreFocus: true }));
uploadBody.addEventListener("scroll", () => {
  if (!uploadHelpCopy.hidden) positionUploadHelp();
}, { passive: true });
window.addEventListener("resize", () => {
  if (!uploadHelpCopy.hidden) positionUploadHelp();
});
uploadDropzone.addEventListener("click", showUploadSourceMenu);
uploadSourceMenu.querySelectorAll("[data-close-source]").forEach((button) => button.addEventListener("click", hideUploadSourceMenu));
uploadSourceMenu.querySelectorAll("[data-upload-source]").forEach((button) => {
  button.addEventListener("click", () => {
    const source = button.dataset.uploadSource;
    if (source === "cancel") {
      hideUploadSourceMenu();
      return;
    }
    const sourceLabels = { photos: "照片圖庫", camera: "拍照", files: "選擇檔案" };
    window.ResearchTracker?.emit("upload_source_selected", {
      source,
      source_label: sourceLabels[source] || source,
      document_type: uploadMode,
      group: usabilityGroup
    });
    showFilePicker();
  });
});
filePickerScreen.querySelector("[data-close-picker]").addEventListener("click", hideFilePicker);
filePickerList.querySelectorAll("[data-sample-file]").forEach((button) => {
  button.addEventListener("click", () => selectSampleFile(button.dataset.sampleFile));
});
filePickerSearch.addEventListener("input", () => {
  const query = filePickerSearch.value.trim().toLowerCase();
  filePickerList.querySelectorAll(".file-picker-row").forEach((row) => {
    row.hidden = !row.textContent.toLowerCase().includes(query);
  });
  filePickerList.querySelectorAll(".file-picker-group").forEach((group) => {
    group.hidden = [...group.querySelectorAll(".file-picker-row")].every((row) => row.hidden);
  });
});
document.querySelector("#file-picker-sort").addEventListener("click", (event) => {
  const sortByName = event.currentTarget.dataset.sort === "recent";
  filePickerList.querySelectorAll(".file-picker-group").forEach((group) => {
    const rows = [...group.querySelectorAll(".file-picker-row")];
    rows.sort((a, b) => sortByName
      ? a.querySelector(".file-picker-name").textContent.localeCompare(b.querySelector(".file-picker-name").textContent, "zh-Hant")
      : Number(b.dataset.recentOrder) - Number(a.dataset.recentOrder));
    rows.forEach((row) => group.append(row));
  });
  event.currentTarget.dataset.sort = sortByName ? "name" : "recent";
  event.currentTarget.textContent = sortByName ? "日期" : "名稱";
});
uploadFileInput.addEventListener("change", () => {
  const files = [...(uploadFileInput.files ?? [])];
  if (uploadMode === "delay-proof") addDelayProofFiles(files);
  else updateBoardingPass(files[0] ?? null);
});
uploadFileList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-upload-file]");
  if (!button) return;
  if (uploadMode === "delay-proof") {
    selectedDelayProofFiles = selectedDelayProofFiles.filter((file) => file.id !== button.dataset.removeUploadFile);
    uploadError.hidden = true;
    uploadError.textContent = "";
    renderUploadFileItems();
    updateDelayProofControls();
  } else {
    uploadFileInput.value = "";
    updateBoardingPass(null);
  }
});
uploadConfirm.addEventListener("click", startUploadSubmission);
uploadDropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadDropzone.classList.add("is-dragging");
});
uploadDropzone.addEventListener("dragleave", () => uploadDropzone.classList.remove("is-dragging"));
uploadDropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadDropzone.classList.remove("is-dragging");
  const files = [...(event.dataTransfer?.files ?? [])];
  if (!files.length) return;
  if (uploadMode === "delay-proof") addDelayProofFiles(files);
  else updateBoardingPass(files[0]);
});

airportComboboxes.forEach((field) => {
  const input = field.querySelector(".airport-input");
  input.dataset.selectedValue = input.value;
  input.addEventListener("focus", () => {
    if (input.dataset.keepSelectionOnFocus === "true") {
      delete input.dataset.keepSelectionOnFocus;
      return;
    }
    openAirportCombobox(field);
  });
  input.addEventListener("input", () => {
    if (field.classList.contains("is-open")) filterAirportOptions(field);
  });
  field.addEventListener("mousedown", (event) => {
    if (event.target.closest("[data-airport-option]")) event.preventDefault();
  });
  field.addEventListener("click", (event) => {
    const option = event.target.closest("[data-airport-option]");
    if (option) chooseAirport(field, option);
  });
  field.addEventListener("keydown", (event) => {
    if (event.target.closest("[data-airport-option]")) return;
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && field.classList.contains("is-open")) {
      event.preventDefault();
      moveAirportActiveOption(field, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Enter" && field.classList.contains("is-open")) {
      const activeIndex = Number(field.dataset.activeIndex ?? -1);
      const options = [...field.querySelectorAll("[data-airport-option]")].filter((option) => !option.hidden);
      if (options.length === 1 || activeIndex >= 0) {
        event.preventDefault();
        chooseAirport(field, options[activeIndex >= 0 ? activeIndex : 0]);
      }
    } else if (event.key === "Escape" && field.classList.contains("is-open")) {
      event.preventDefault();
      event.stopPropagation();
      closeAirportCombobox(field);
      input.focus({ preventScroll: true });
    }
  });
  field.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!field.contains(document.activeElement)) closeAirportCombobox(field);
    }, 0);
  });
});

renderBankOptions();
bankComboboxInput.addEventListener("focus", openBankCombobox);
bankComboboxInput.addEventListener("input", () => {
  if (bankCombobox.classList.contains("is-open")) filterBankOptions();
});
bankCombobox.addEventListener("mousedown", (event) => {
  if (event.target.closest("[data-bank-option]")) event.preventDefault();
});
bankCombobox.addEventListener("click", (event) => {
  const option = event.target.closest("[data-bank-option]");
  if (option) chooseBankOption(option);
});
bankCombobox.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && bankCombobox.classList.contains("is-open")) {
    event.preventDefault();
    moveBankActiveOption(event.key === "ArrowDown" ? 1 : -1);
  } else if (event.key === "Enter" && bankCombobox.classList.contains("is-open")) {
    event.preventDefault();
    const activeIndex = Number(bankCombobox.dataset.activeIndex ?? -1);
    const options = [...bankCombobox.querySelectorAll("[data-bank-option]")].filter((option) => !option.hidden);
    if (activeIndex >= 0) chooseBankOption(options[activeIndex]);
  } else if (event.key === "Escape" && bankCombobox.classList.contains("is-open")) {
    event.preventDefault();
    event.stopPropagation();
    closeBankCombobox();
  }
});
bankCombobox.addEventListener("focusout", () => {
  window.setTimeout(() => {
    if (!bankCombobox.contains(document.activeElement)) closeBankCombobox();
  }, 0);
});

branchComboboxInput.addEventListener("focus", openBranchCombobox);
branchComboboxInput.addEventListener("input", () => {
  if (branchCombobox.classList.contains("is-open")) filterBranchOptions();
});
branchCombobox.addEventListener("mousedown", (event) => {
  if (event.target.closest("[data-branch-option]")) event.preventDefault();
});
branchCombobox.addEventListener("click", (event) => {
  const option = event.target.closest("[data-branch-option]");
  if (option) chooseBranchOption(option);
});
branchCombobox.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && branchCombobox.classList.contains("is-open")) {
    event.preventDefault();
    moveBranchActiveOption(event.key === "ArrowDown" ? 1 : -1);
  } else if (event.key === "Enter" && branchCombobox.classList.contains("is-open")) {
    event.preventDefault();
    const activeIndex = Number(branchCombobox.dataset.activeIndex ?? -1);
    const options = [...branchCombobox.querySelectorAll("[data-branch-option]")].filter((option) => !option.hidden);
    if (activeIndex >= 0) chooseBranchOption(options[activeIndex]);
    else if (options.length === 1) chooseBranchOption(options[0]);
  } else if (event.key === "Escape" && branchCombobox.classList.contains("is-open")) {
    event.preventDefault();
    event.stopPropagation();
    closeBranchCombobox();
  }
});
branchCombobox.addEventListener("focusout", () => {
  window.setTimeout(() => {
    if (!branchCombobox.contains(document.activeElement)) closeBranchCombobox();
  }, 0);
});

document.addEventListener("pointerdown", (event) => {
  airportComboboxes.forEach((field) => {
    if (!field.contains(event.target)) closeAirportCombobox(field);
  });
  if (!bankCombobox.contains(event.target)) closeBankCombobox();
  if (!branchCombobox.contains(event.target)) closeBranchCombobox();
});

boardingInfoDialog.querySelectorAll("[data-close-info]").forEach((button) => button.addEventListener("click", closeBoardingInfoDialog));
scheduledTimeDialog.querySelectorAll("[data-close-scheduled-time]").forEach((button) => button.addEventListener("click", () => closeScheduledTimeDialog()));
scheduledDateInput.addEventListener("input", () => formatScheduledDateInput(scheduledDateInput));
scheduledHourInput.addEventListener("input", () => formatScheduledHourInput(scheduledHourInput));
scheduledTimeForm.addEventListener("input", updateScheduledTimeForm);
[scheduledDateInput, scheduledHourInput].forEach((fieldInput) => {
  fieldInput.addEventListener("blur", () => {
    fieldInput.dataset.touched = "true";
    updateScheduledTimeForm();
  });
});
scheduledTimeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (confirmScheduledTimeButton.disabled) return;
  closeScheduledTimeDialog({ confirmed: true });
});
bankInfoDialog.querySelectorAll("[data-close-bank-info]").forEach((button) => button.addEventListener("click", () => closeBankInfoDialog()));
bankbookDropzone.addEventListener("click", () => showFilePicker("bankbook"));
bankbookFileInput.addEventListener("change", () => handleBankbookFile(bankbookFileInput.files[0]));
bankbookRemove.addEventListener("click", removeBankbookFile);
bankInfoForm.addEventListener("input", (event) => {
  if (event.target.name === "account" && !bankAccountError.hidden) validateBankAccount();
  updateBankInfoButton();
});
bankInfoForm.elements.account.addEventListener("blur", validateBankAccount);
bankInfoForm.addEventListener("change", updateBankInfoButton);
bankInfoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (confirmBankInfoButton.disabled) return;
  if (isUsabilityResearch) {
    window.ResearchTracker?.emit("bank_info_submitted", { group: usabilityGroup }, "bank-info", "送出匯款資料");
  }
  closeBankInfoDialog({ restoreFocus: false, showPrompt: false });
  appendUserMessage("確認送出");
  openOtpDialog({ resetSession: true });
});
otpForm.addEventListener("input", () => {
  otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
  if (!otpExpired && otpAttemptCount < 5) {
    otpError.hidden = true;
    otpField.classList.remove("is-invalid");
    otpInput.setAttribute("aria-invalid", "false");
    otpHelp.hidden = false;
  }
  renderOtpState();
});
otpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (otpNext.disabled || otpIsVerifying) return;
  otpIsVerifying = true;
  otpNext.textContent = "驗證中...";
  renderOtpState();
  window.clearTimeout(otpVerifyTimer);
  otpVerifyTimer = window.setTimeout(() => {
    otpIsVerifying = false;
    otpNext.textContent = "下一步";
    if (otpExpired || otpExpirySeconds <= 0) {
      otpExpired = true;
      showOtpError("動態密碼已失效，請重新發送");
      renderOtpState();
      return;
    }
    if (otpInput.value === simulatedOtpApiErrorCode) {
      finishOtpApiError();
      return;
    }
    if (otpInput.value !== simulatedOtpCode) {
      otpAttemptCount += 1;
      otpInput.value = "";
      showOtpError(otpAttemptCount >= 5 ? "輸入錯誤達 5 次，請重新發送驗證碼" : "動態密碼輸入錯誤");
      renderOtpState();
      return;
    }
    finishOtpVerification();
  }, 1000);
});
otpResend.addEventListener("click", resendOtp);
otpHelpTrigger.addEventListener("click", () => {
  otpHelpNote.hidden = !otpHelpNote.hidden;
  otpHelpTrigger.setAttribute("aria-expanded", String(!otpHelpNote.hidden));
  if (!otpHelpNote.hidden) positionOtpHelp();
});
otpHelpClose.addEventListener("click", () => {
  otpHelpNote.hidden = true;
  otpHelpTrigger.setAttribute("aria-expanded", "false");
});
loginOtpHelpTrigger.addEventListener("click", () => {
  loginOtpHelpNote.hidden = !loginOtpHelpNote.hidden;
  loginOtpHelpTrigger.setAttribute("aria-expanded", String(!loginOtpHelpNote.hidden));
  if (!loginOtpHelpNote.hidden) positionLoginOtpHelp();
});
loginOtpHelpClose.addEventListener("click", () => {
  loginOtpHelpNote.hidden = true;
  loginOtpHelpTrigger.setAttribute("aria-expanded", "false");
});
window.addEventListener("resize", positionOtpHelp);
window.addEventListener("resize", positionLoginOtpHelp);
window.visualViewport?.addEventListener("resize", positionOtpHelp);
window.visualViewport?.addEventListener("resize", positionLoginOtpHelp);
otpDialog.addEventListener("click", (event) => {
  if (otpHelpNote.hidden || event.target.closest(".otp-help") || event.target.closest("#otp-help-note")) return;
  otpHelpNote.hidden = true;
  otpHelpTrigger.setAttribute("aria-expanded", "false");
});
authDialog.addEventListener("click", (event) => {
  if (loginOtpHelpNote.hidden || event.target.closest(".login-code-help") || event.target.closest("#login-otp-help-note")) return;
  loginOtpHelpNote.hidden = true;
  loginOtpHelpTrigger.setAttribute("aria-expanded", "false");
});
otpDialog.querySelectorAll("[data-close-otp]").forEach((button) => button.addEventListener("click", closeOtpDialog));
updateBankInfoButton();

function isValidBoardingDate(yearValue, dateValue) {
  const dateMatch = /^(\d{2})\/(\d{2})$/.exec(dateValue.trim());
  if (!dateMatch) return false;

  const month = Number(dateMatch[1]);
  const day = Number(dateMatch[2]);
  if (month < 1 || month > 12 || day < 1) return false;

  if (boardingYearError(yearValue)) return false;
  const year = Number(yearValue.trim());
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return false;

  const today = new Date();
  return year < today.getFullYear()
    || (year === today.getFullYear() && (month < today.getMonth() + 1
      || (month === today.getMonth() + 1 && day <= today.getDate())));
}

function boardingYearError(yearValue) {
  const normalized = yearValue.trim();
  if (!/^\d{4}$/.test(normalized)) return "請輸入正確年份";
  return Number(normalized) > new Date().getFullYear() ? "起飛年份不可晚於今年" : "";
}

function setBoardingFieldError(input, message) {
  const field = input.closest(".boarding-field");
  const error = field.querySelector(".boarding-field-error");
  const isInvalid = Boolean(message);
  field.classList.toggle("is-invalid", isInvalid);
  input.setAttribute("aria-invalid", String(isInvalid));
  error.hidden = !isInvalid;
  if (isInvalid) error.textContent = message;
}

function formatBoardingDateInput(input) {
  const selectionStart = input.selectionStart ?? input.value.length;
  const digitsBeforeCaret = input.value.slice(0, selectionStart).replace(/\D/g, "").length;
  const digits = input.value.replace(/\D/g, "").slice(0, 4);
  const hasMonth = digits.length >= 2;
  input.value = hasMonth
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;

  const caretPosition = digitsBeforeCaret + (hasMonth && digitsBeforeCaret >= 2 ? 1 : 0);
  input.setSelectionRange(Math.min(caretPosition, input.value.length), Math.min(caretPosition, input.value.length));
}

function validateBoardingInfo() {
  const { passenger, flight, origin, destination, year, date } = boardingInfoForm.elements;
  const errors = [];
  const requiredFields = [
    [passenger, "請輸入乘客姓名"],
    [flight, "請輸入航班編號"],
    [origin, "請選擇出發地"],
    [destination, "請選擇目的地"],
  ];

  requiredFields.forEach(([field, message]) => {
    const value = field.value.trim();
    let fieldMessage = value ? "" : message;
    if (value && (field.name === "origin" || field.name === "destination")) {
      const options = field.closest("[data-airport]").querySelectorAll("[data-airport-option]");
      if (![...options].some((option) => option.dataset.value === value)) fieldMessage = message;
    }
    setBoardingFieldError(field, fieldMessage);
    if (fieldMessage) errors.push(field);
  });

  const yearMessage = boardingYearError(year.value);
  let dateMessage = "";
  if (!yearMessage && !isValidBoardingDate(year.value, date.value)) {
    dateMessage = "請輸入不晚於今天的正確起飛日期";
  }
  setBoardingFieldError(year, yearMessage);
  setBoardingFieldError(date, dateMessage);
  if (yearMessage) errors.push(year);
  if (dateMessage) errors.push(date);

  return errors;
}

function updateBoardingInfoButton() {
  const fields = [...boardingInfoForm.querySelectorAll("[name]")];
  const isComplete = fields.every((field) => {
    if (field.matches(".airport-input") && field.closest(".airport-combobox").classList.contains("is-open")) {
      return Boolean(field.dataset.selectedValue?.trim());
    }
    return Boolean(field.value.trim());
  });
  confirmInfoButton.disabled = boardingInfoConfirmed || !isComplete;
  confirmInfoButton.textContent = "確認資訊";
}

boardingInfoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  boardingInfoValidationAttempted = true;
  const invalidFields = validateBoardingInfo();
  if (invalidFields.length) {
    invalidFields[0].focus({ preventScroll: true });
    invalidFields[0].closest(".boarding-field").scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }

  boardingInfoConfirmed = true;
  updateBoardingInfoButton();
  airportComboboxes.forEach((field) => closeAirportCombobox(field));
  const currentSnapshot = readBoardingInfoSnapshot();
  const baselineSnapshot = boardingInfoOriginalSnapshot
    ?? Object.fromEntries(Object.keys(currentSnapshot).map((name) => [name, ""]));
  const changesFromOriginal = changedBoardingInfoFields(currentSnapshot, baselineSnapshot);
  boardingInfoHasSubstantiveEdits = changesFromOriginal.some((name) => name !== "year");
  const previousSnapshot = boardingInfoPreviousSnapshot ?? baselineSnapshot;
  const substantiveChanges = changedBoardingInfoFields(currentSnapshot, previousSnapshot)
    .filter((name) => name !== "year");
  if (substantiveChanges.length) boardingInfoModificationCount += 1;
  boardingInfoPreviousSnapshot = { ...currentSnapshot };
  boardingInfoDialog.hidden = true;

  if (boardingInfoModificationCount >= 3) {
    continueAfterBoardingInfo();
    return;
  }

  appendUserMessage(changesFromOriginal.length ? "資訊修改完畢" : "確認資訊");
  showBoardingInfoReview(currentSnapshot, { modified: changesFromOriginal.length > 0 });
});
boardingInfoForm.elements.date.addEventListener("input", (event) => {
  formatBoardingDateInput(event.currentTarget);
});
boardingInfoForm.addEventListener("input", () => {
  boardingInfoConfirmed = false;
  updateBoardingInfoButton();
  if (boardingInfoValidationAttempted) validateBoardingInfo();
});
boardingInfoForm.elements.year.addEventListener("input", (event) => {
  const year = event.currentTarget;
  const value = year.value.trim();
  if (/^\d{4}$/.test(value)) setBoardingFieldError(year, boardingYearError(value));
  else if (!boardingInfoValidationAttempted) setBoardingFieldError(year, "");
});
boardingInfoForm.addEventListener("change", () => {
  boardingInfoConfirmed = false;
  updateBoardingInfoButton();
  if (boardingInfoValidationAttempted) validateBoardingInfo();
});
updateBoardingInfoButton();

chatScreen.addEventListener("click", (event) => {
  const button = event.target.closest("[data-chat-action]");
  if (!button) return;
  switch (button.dataset.chatAction) {
    case "claim-confirm":
      openClaimLogin(button);
      break;
    case "return-personal-data":
      showPersonalDataNotice();
      break;
    case "return-login":
      setComposerFlowLock(true);
      showAuthDialog({ origin: "claim", returnFocus: button });
      break;
    case "open-upload":
      showUploadDialog();
      break;
    case "retry-delay-proof":
      showUploadDialog("delay-proof");
      break;
    case "upload-delay-proof":
      appendUserMessage("上傳班機延誤證明");
      showUploadDialog("delay-proof", button);
      break;
    case "fill-bank-info":
      openBankInfoDialog();
      break;
    case "return-boarding-info":
      boardingInfoDialog.hidden = false;
      boardingInfoForm.elements.passenger.focus({ preventScroll: true });
      break;
    case "return-scheduled-time":
      openScheduledTimeDialog();
      break;
    case "retry-boarding-pass":
      appendUserMessage("重新上傳");
      showUploadDialog("boarding-pass", button);
      break;
    case "manual-boarding-info":
      disableChatActions(button);
      if (isUsabilityResearch && usabilityGroup === "B" && boardingPassRecognitionFailures > 0) {
        window.ResearchTracker?.recoveryFound({ source: "electronic-boarding-pass-ocr-failure", method: "manual-entry", group: usabilityGroup });
      }
      appendUserMessage("手動輸入");
      prepareBoardingInfoSession({ manual: true });
      boardingInfoDialog.hidden = false;
      boardingInfoForm.elements.passenger.focus({ preventScroll: true });
      break;
    case "confirm-boarding-info":
      disableChatActions(button);
      appendUserMessage("確認送出");
      if (boardingInfoHasSubstantiveEdits) continueAfterBoardingInfo();
      else continueToBankInfo();
      break;
    case "edit-boarding-info":
      disableChatActions(button);
      appendUserMessage("資料有誤");
      appendAssistantMessage("好的，請問修改資訊。");
      boardingInfoConfirmed = false;
      updateBoardingInfoButton();
      boardingInfoDialog.hidden = false;
      boardingInfoForm.elements.passenger.focus({ preventScroll: true });
      break;
    case "claim-member":
      showOfficialConfirm("你即將離開阿發，前往國泰產險會員中心。", memberCenterUrl);
      break;
    case "claim-register":
      openClaimSignup(button);
      break;
    case "claim-website":
      showOfficialConfirm("你即將離開阿發，前往產險服務條款頁。", officialClaimUrl);
      break;
    case "restart-chat":
      startChat();
      break;
  }
});

confirmDialog.addEventListener("click", (event) => {
  if (event.target === confirmDialog) confirmDialog.close();
});

window.addEventListener("hashchange", () => {
  const showChat = window.location.hash === "#chat";
  setScreen(showChat);
  if (showChat && chatScreen.childElementCount === 0) appendDefaultConsultation();
});

if (window.location.hash === "#chat") {
  try {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  } catch {
    window.location.hash = "";
  }
}
setScreen(false);

airportComboboxes.forEach((field) => {
  const input = field.querySelector(".airport-input");
  const results = field.querySelector(".airport-results");
  const options = document.createDocumentFragment();
  airportDirectory.forEach(({ code, city, englishName }, index) => {
    const option = document.createElement("button");
    option.className = "airport-option";
    option.type = "button";
    option.id = `${input.id}-option-${index}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.airportOption = "";
    option.dataset.value = code;
    option.dataset.search = `${code} ${city} ${englishName}`;
    option.textContent = `${code} ${city}`;
    options.append(option);
  });
  const otherOption = document.createElement("button");
  otherOption.className = "airport-option";
  otherOption.type = "button";
  otherOption.id = `${input.id}-option-other`;
  otherOption.setAttribute("role", "option");
  otherOption.setAttribute("aria-selected", "false");
  otherOption.dataset.airportOption = "";
  otherOption.dataset.value = "其他";
  otherOption.dataset.search = "其他 other";
  otherOption.textContent = "其他";
  options.append(otherOption);
  results.prepend(options);
});

function setResearchAutofillValue(selector, value) {
  const input = document.querySelector(selector);
  if (!input || value == null || value === "") return false;
  input.value = String(value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function autofillResearchCurrentPage(data = {}) {
  if (!boardingInfoDialog.hidden) {
    const fields = { passenger: data.passenger, flight: data.flight, origin: data.origin, destination: data.destination, year: data.year, date: data.date };
    let filled = 0;
    for (const [name, value] of Object.entries(fields)) {
      const field = boardingInfoForm.elements[name];
      if (setResearchAutofillValue(`#boarding-info-form [name="${name}"]`, value)) {
        filled += 1;
        if (field?.matches(".airport-input")) {
          field.dataset.selectedValue = field.value.trim();
          field.setCustomValidity("");
        }
      }
    }
    updateBoardingInfoButton();
    return { filled: filled > 0, screen: "登機證資料確認" };
  }

  if (!scheduledTimeDialog.hidden) {
    const filled = setResearchAutofillValue("#scheduled-date", data.scheduledDate)
      | setResearchAutofillValue("#scheduled-hour", data.scheduledHour);
    updateScheduledTimeForm();
    return { filled: Boolean(filled), screen: "原定班機時間" };
  }

  if (!authDialog.hidden) {
    const activeView = authDialog.querySelector(".auth-view:not([hidden])");
    const values = {
      "signup-id": data.identity,
      "signup-birthday": data.signupBirthday,
      "signup-name": data.signupName,
      "signup-phone": data.signupPhone,
      "signup-otp-input": data.otp,
      "signup-password": data.signupPassword,
      "signup-confirm-password": data.signupPassword,
      "login-id": data.identity,
      "login-password": data.loginPassword,
      "login-code-id": data.identity,
      "login-otp-input": data.otp,
    };
    let filled = 0;
    activeView?.querySelectorAll("input[id],select[id],textarea[id]").forEach((field) => {
      if (setResearchAutofillValue(`#${field.id}`, values[field.id])) filled += 1;
    });
    return { filled: filled > 0, screen: "會員登入／註冊" };
  }

  if (!otpDialog.hidden) {
    const filled = setResearchAutofillValue("#otp-input", data.otp);
    return { filled, screen: "驗證碼" };
  }

  if (!bankInfoDialog.hidden) {
    if (data.bankCode) setBankSelection(data.bankCode);
    if (data.bankCode || data.branch) updateBankBranches(data.branch || "");
    const filled = setResearchAutofillValue("#bank-info-form [name='account']", data.bankAccount);
    validateBankAccount();
    updateBankInfoButton();
    return { filled: Boolean(filled || data.bankCode || data.branch), screen: "匯款資料" };
  }

  return { filled: false, screen: "" };
}

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || event.data?.type !== "flight-delay-autofill" || !isUsabilityResearch) return;
  const result = autofillResearchCurrentPage(event.data.data || {});
  window.parent.postMessage({ type: "flight-delay-autofill-complete", ...result }, "*");
});

if (window.parent !== window && isUsabilityResearch) {
  window.parent.postMessage({ type: "flight-delay-flow-ready" }, "*");
}
