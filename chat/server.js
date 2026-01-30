const express = require('express')
const app = express()
const Message = require('./MessageSchema')

const dbconnect = require('./dbconnect')

dbconnect()
// Create http server
const http = require('http').createServer(app)
//relate socket with server
const { Server } = require('socket.io')
const io = new Server(http)

//add midelware for json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//read html
app.use(express.static(__dirname))

//connection of user
io.on('connection', (socket) => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

//get message
app.get('/message', async (req, res) => {
  const msg = await Message.find({})
  res.json(msg)
})

//post message
app.post('/message', async (req, res) => {
  const { text } = req.body

  if (text) {
    //save data
    const newMsg = new Message({ text })
    await newMsg.save()

    //send message to all user
    io.emit('message:new', newMsg)
    res.sendStatus(200)
  }
})
http.listen(5000, () => {
  console.log('server work in', 5000)
})
