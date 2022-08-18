// todo.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  },
  userId: {  // 新增加入關聯設定
    type: Schema.Types.ObjectId, //定義 userId 這個項目是一個 ObjectId，也就是它會連向另一個資料物件
    ref: 'User', //定義參考對象是 User model
    index: true,
    required: true
  }
})
module.exports = mongoose.model('Todo', todoSchema)