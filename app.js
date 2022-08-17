//串接模組
const express = require('express')
const exphbs = require('express-handlebars') //樣版引擎
const bodyParser = require('body-parser') // 引用 body-parser(用來抓取res.body)
const methodOverride = require('method-override') // 載入 method-override
const routes = require('./routes') //引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案
require('./config/mongoose') //載入mongoose
const session = require('express-session')
const PORT = process.env.PORT || 3000 //如果在 Heroku 環境則使用 process.env.PORT，否則為本地環境，使用 3000 

const app = express()

//樣版引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
//session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// 將 request 導入路由器
app.use(routes)

//監聽網頁
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}.`)
})