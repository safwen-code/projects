const mongoose = require('mongoose')

let urlAltlas =
  'mongodb+srv://safwen1234:safwen1234@cluster0.3unixgc.mongodb.net/socket'

const dbconnect = async () => {
  try {
    //connect mongo
    await mongoose.connect(urlAltlas)
    console.log('connect db')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = dbconnect
