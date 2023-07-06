// app.js 裡和「資料庫連線」有關的程式碼都複製過來一份

// 載入 todo model
const Todo = require('../todo')

// 取得資料庫連線狀態
// 連線資料改為在/config/mongoose, 修改引用位子要注意
const db = require('../../config/mongoose')

// 連線成功, 新增10筆資料
db.once('open', () => {

  for (let i = 0; i < 10; i++) {
    Todo.create({name:`name-${i}`})
  }

  console.log('done')
})