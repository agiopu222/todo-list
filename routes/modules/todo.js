const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// 路由設定 新增
router.get('/new', (req, res) => {
    return res.render('new')
  })
  
  // -----------------------
  
  // CRUD, Create
  // 寫法1
  router.post('/', (req, res) => {
    const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
    return Todo.create ({ name: name })     // 存入資料庫
      .then(() => res.redirect('/')) // 新增完成後導回首頁
      .catch(error => console.log(error))
  })
  
  // 寫法2
  // router.post('/', (req, res) => {
  //   const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  //   const todo = new Todo ({name: name})
  //   return todo
  //     .save()
  //     .then(() => res.redirect('/')) // 新增完成後導回首頁
  //     .catch(error => console.log(error))
  // })
  
  // -----------------------
  
  // CRUD, Read/Detail
  router.get('/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then((todo) => res.render('detail', { todo }))
      .catch(error => console.log(error))
  })
  
  // -----------------------
  
  // 路由設定 update
  router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then((todo) => res.render('edit', { todo }))
      .catch(error => console.log(error))
  })
  
  // CRUD, Update/edit
  router.put('/:id', (req, res) => {
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
  
  router.delete('/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

  module.exports = router