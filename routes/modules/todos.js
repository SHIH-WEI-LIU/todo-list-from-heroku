const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

//(設定new.hbs頁面
router.get('/new', (req, res) => {
  return res.render('new')
})
//設定post路由)（要記得設定body-parser）(todos 是因為<form action="/todos" method="POST">)
router.post('/', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  const userId = req.user._id      //從序列化中的 done(null, user._id)取出user._id
  return Todo.create({ name, userId })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

//瀏覽特定 To-do詳細資料的路由
router.get('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  return Todo.findOne({ _id, userId }) //從資料庫查找特定資料
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

//(編輯todo資料頁面的路由
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})
//修改特定 todo 資料的路由)
router.put('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  const { name, isDone } = req.body
  return Todo.findOne({ _id, userId })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//刪除todo的路由
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  return Todo.findOne({ _id, userId })
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router