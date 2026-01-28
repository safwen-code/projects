const express = require('express')
const app = express()

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

var message = []
//get message
app.get('/message', (req, res) => {
  res.send(message)
})

//post message
app.post('/message', (req, res) => {
  const { text } = req.body
  if (text) {
    message.push(text)
    //send message to all user
    io.emit('message:new', text)
    res.sendStatus(200)
  }
})
http.listen(5000, () => {
  console.log('server work in', 5000)
})
