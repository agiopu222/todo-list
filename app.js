// 載入 express 並建構應用程式伺服器
const express = require('express')

// 載入 mongoose
const mongoose = require('mongoose')

// 載入 handlebars
const exphbs = require('express-handlebars')

// 載入 Todo model
const Todo = require('./models/todo')

const app = express()

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

mongoose.connect(process.env.MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 設定樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main' , extname: '.hbs' }));
app.set('view engine', 'hbs')

// 引用 body-parser
const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 載入 method-override
const methodOverride = require('method-override') 
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// Todo路由設定
app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: 'asc' }) // 新增這裡：根據 _id 升冪排序
    .then(todos => res.render('index', { todos: todos })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

// 路由設定 新增
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// -----------------------

// CRUD, Create
// 寫法1
app.post('/todos', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Todo.create ({ name: name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 寫法2
// app.post('/todos', (req, res) => {
//   const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
//   const todo = new Todo ({name: name})
//   return todo
//     .save()
//     .then(() => res.redirect('/')) // 新增完成後導回首頁
//     .catch(error => console.log(error))
// })

// -----------------------

// CRUD, Read/Detail
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// -----------------------

// 路由設定 update
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// CRUD, Update/edit
app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save() //這邊不能用lean, 因為用了lean資料就是乾淨的, 就沒有save這個function可以用
    })
    .then(()=> res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// -----------------------

// CRUD, Delete

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})