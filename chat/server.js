const express = require('express')
var app = express()

app.use(express.static(__dirname))

let server = app.listen(5000, () => {
  console.log('listen in 5000')
})
