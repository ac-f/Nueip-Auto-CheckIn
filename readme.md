# Nueip 自動打卡小程式

## 安裝條件
1. node.js 版本 20 或以上

## 使用方式
1. 安裝相依套件
    ```bash
    cd <專案資料夾>
    ```
    ```bash
    npm i
    ```
2. 修改 index.js 檔案中的帳號密碼
    ```javascript
        const CONFIG = {
            // 預設登入網址, 無須調整
            loginUrl: 'https://portal.nueip.com/login',
            // 公司統編
            companyCode: "",
            // 員工編號 
            employeeID: "",
            // 密碼 
            password: "",
            // 打卡經度 
            latitude: 25.0478,
            // 打卡緯度 
            longitude: 121.5319,
            // 紀錄檔案名稱, 無須調整 
            recordFile: 'time.txt',
            // 排程執行週期, 預設每十分鐘執行一次 
            executePeriod: EXECUTE_PER_TEN_MINUTE,
            // 排程執行策略 CHECK_IN: 上班打卡, CHECK_OUT: 下班打卡 
            executeStrategy: EXECUTE_STRATEGY.CHECK_IN, 
        }
    ```

3. 執行程式
    ```bash
    node index.js
    ```
## 自動執行

### Mac
#### 方法一
使用pm2套件在本地部署一個服務, 這樣就不用擔心關機的問題了
1. 安裝 pm2
   ```bash
   npm install -g pm2
   ```
2. 啟動服務
   ```bash
   pm2 start index.js --name 'Nueip Auto CheckIn'
   ```
3. 讓服務在開機時自動啟動
   ```bash
   pm2 startup
   ```
4. 保存當前服務
   ```bash
   pm2 save
   ```
5. 查看服務狀態
   ```bash
   pm2 log 'Nueip Auto CheckIn'
   ```  
6. 如果要刪除服務
   ```bash
   pm2 stop 'Nueip Auto CheckIn'
   pm2 delete 'Nueip Auto CheckIn'
   pm2 save --force
   ```
       
#### 方法二
使用 crontab 設定排程執行, 但有些電腦似乎沒辦法用(我的就是)


### Windows 
可搭配 windows 的工作排程器, 設定每天固定時間執行即可


