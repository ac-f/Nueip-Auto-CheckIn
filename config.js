
const EXECUTE_STATUS = {
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
}


// 每小時執行一次
const EXECUTE_PER_HOUR = '0 * * * *';
// 每10分鐘執行一次
const EXECUTE_PER_TEN_MINUTE = '*/10 * * * *';
// 每秒執行一次
const EXECUTE_PER_SECOND = '* * * * * *';

const EXECUTE_STRATEGY = {
    CHECK_IN: {
        titleText: '上班',
    },
    CHECK_OUT: {
        titleText: '下班',
    },
}

const CONFIG = {
    loginUrl: 'https://portal.nueip.com/login',
    companyCode: "",
    employeeID: "",
    password: "",
    latitude: 25.0478,
    longitude: 121.5319,
    recordFile: 'time.txt',
    executePeriod: EXECUTE_PER_TEN_MINUTE,
    executeStrategy: EXECUTE_STRATEGY.CHECK_IN,
}


module.exports.EXECUTE_STATUS = EXECUTE_STATUS;
module.exports.CONFIG = CONFIG;
module.exports.EXECUTE_STRATEGY = EXECUTE_STRATEGY;