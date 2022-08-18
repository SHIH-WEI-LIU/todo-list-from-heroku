//串接模組
const express = require('express')
const exphbs = require('express-handlebars') //樣版引擎
const bodyParser = require('body-parser') // 引用 body-parser(用來抓取res.body)
const methodOverride = require('method-override') // 載入 method-override
const routes = require('./routes') //引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案
const usePassport = require('./config/passport')//載入config/passport
require('./config/mongoose') //載入mongoose
require('dotenv').config() //載入dotenv
const session = require('express-session')//載入session
const flash = require('connect-flash')   // 引用套件
if (process.env.NODE_ENV !== 'production') { //如果應用程式不是在「正式上線模式 (production mode)」中執行，就透過 dotenv 去讀取在 env 檔案裡的資訊
  require('dotenv').config()
}
const PORT = process.env.PORT

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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
//呼叫 Passport 函式並傳入 app
usePassport(app)
//flash
app.use(flash())
//設定本地變數(所有"handlebars"都可以使用的變數)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 從req.flash中拿 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 從req.flash中拿 warning_msg 訊息
  next()
})
// 將 request 導入路由器
app.use(routes)


//監聽網頁
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}.`)
})