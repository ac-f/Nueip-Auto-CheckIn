const {chromium} = require('playwright');  // 你可以選擇使用 chrome 或 firefox
const fs = require('fs');
const cron = require('node-cron');
const {EXECUTE_STRATEGY, EXECUTE_STATUS, CONFIG} = require('./config');
let currentStatus;

// 取得今天的日期，用來判斷今天是否已經打卡
const today = new Date().toISOString().split('T')[0];  // 例如 "2025-01-02"

async function job() {
    console.log(`today ${today}`);

    console.log(`CONFIG: ${JSON.stringify(CONFIG)}`);
    if (!CONFIG.companyCode || !CONFIG.employeeID || !CONFIG.password) {
        console.error('請設置 COMPANY_CODE, EMPLOYEE_ID 和 PASSWORD 環境變數。');
        return;
    }

    if (!fs.existsSync(CONFIG.recordFile)) {
        console.log('打卡記錄文件不存在，創建文件。');
        fs.writeFileSync(CONFIG.recordFile, '', 'utf8');
    }

    const lastPunchDate = fs.readFileSync(CONFIG.recordFile, 'utf8').trim();
    const isProcessing = currentStatus === EXECUTE_STATUS.PROCESSING;

    if (isNotWithinTimeRange) {
        console.log('不在打卡時間範圍內，跳過打卡。');
        return;
    }
    if (lastPunchDate === today) {
        console.log('今天已經打卡過了，跳過打卡。');
        return;
    }
    if (isProcessing) {
        console.log('正在打卡中，請稍後再試。');
        return;
    }

    currentStatus = EXECUTE_STATUS.PROCESSING;

    // 啟動瀏覽器
    const browser = await chromium.launch({headless: false}); // 如果需要看到操作，設置 headless: false
    // 創建新的瀏覽器上下文並設置地理位置的權限
    const context = await browser.newContext();
    await context.setGeolocation({latitude: CONFIG.latitude, longitude: CONFIG.longitude});


    // 設定網站的位置信息權限
    await context.grantPermissions(['geolocation'], {  // 'geolocation' 是位置權限
        origin: 'https://portal.nueip.com',  // 目標網站的 URL，根據你實際的網站替換
    });

    const page = await context.newPage();

    // 開啟打卡網站
    await page.goto(CONFIG.loginUrl);

    // 填寫登入資料
    // 填寫公司代碼
    await page.fill('input[name="inputCompany"]', CONFIG.companyCode);
    // 填寫員工編號
    await page.fill('input[name="inputID"]', CONFIG.employeeID);
    // 填寫密碼
    await page.fill('input[name="inputPassword"]', CONFIG.password);

    // 提交登入表單
    await page.click('.login-button');

    // 等待打卡頁面載入
    await page.waitForSelector(`button.el-button.punch-button >> text=${CONFIG.executeStrategy.titleText}`);

    // 點擊打卡按鈕
    await page.click(`button.el-button.punch-button >> text=${CONFIG.executeStrategy.titleText}`);

    // 確認是否打卡成功（可以等打卡後頁面更新的標誌）
    await page.waitForSelector('text=GPS打卡成功');

    console.log(`打${CONFIG.executeStrategy.titleText}成功！`);
    console.log('=========');

    // 記錄打卡時間
    writeLog();

    // 關閉瀏覽器
    await browser.close();
};


function writeLog() {
    const timestamp = new Date().toISOString().split('T')[0];  // 例如 "2025-01-02"
    fs.writeFileSync(CONFIG.recordFile, `${timestamp}`, 'utf8');
    currentStatus = EXECUTE_STATUS.SUCCESS;
}

function isNotWithinTimeRange(config) {
    const now = new Date(); // 取得當前時間
    const currentHour = now.getHours(); // 取得目前的小時（0-23）

    if (config.executeStrategy === EXECUTE_STRATEGY.CHECK_IN) {
        // 判斷是否在 9 ~ 14 點之間
        console.log("判斷是否在 9 ~ 12 點之間")
        return !currentHour >= 9 && currentHour < 12;
    } else if (config.executeStrategy === EXECUTE_STRATEGY.CHECK_OUT) {
        // 判斷是否在 18 ~ 24 點之間
        console.log("判斷是否在 18 ~ 24 點之間")
        return !currentHour >= 18 && currentHour < 24;
    } else {
        console.error('未知的打卡策略');
    }
    return true;
}

cron.schedule(CONFIG.executePeriod, async () => {

    await job();
});