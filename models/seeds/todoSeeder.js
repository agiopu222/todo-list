// app.js 裡和「資料庫連線」有關的程式碼都複製過來一份

// 載入 mongoose
const mongoose = require('mongoose')

// 載入 todo model
const Todo = require('../todo')

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
// 連線成功, 新增10筆資料
db.once('open', () => {
  console.log('mongodb connected!')

  for (let i = 0; i < 10; i++) {
    Todo.create({name:`name-${i}`})
  }

  console.log('done')
})