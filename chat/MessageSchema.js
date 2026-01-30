const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  text: String,
  date: Date,
})
const Message = mongoose.model('Message', MessageSchema)

module.exports = Message
