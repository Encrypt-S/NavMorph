const socketIo =  require('socket.io')
const serverModeCtrl = require('../db/serverMode.ctrl')
const Logger = require('../logger')


socketCtrl = {}
    
  socketCtrl.setupServerSocket = (socket) => {
    return new Promise((fufill, reject) => {    
      try {
        socket.on('connection', function(socket){
          console.log('a user connected')
          socket.on('disconnect', function(){
            console.log('USER DISCONNECTED')
          })
          socket.on('ADD_MESSAGE', (message) => {
            socket.emit('MESSAGE', {type:'NEW_MESSAGE', text: message})
          })
        })
        socketCtrl.startDbWatch(socket)
        fufill()
      } catch (err) {
        reject(err)
      }
    })
  }

  socketCtrl.startDbWatch = (socket) => {
    setInterval(() => {
      serverModeCtrl.checkMode()
      .then((mode) => {
        socket.emit('SERVER_MODE', mode[0].server_mode)
      })
      .then(() => {
        return serverModeCtrl.checkMessage()
      })
      .then((serverMessageData) => {
        socket.emit('SERVER_MESSAGE', {
          serverMessage: serverMessageData[0].server_message,
          serverMessageType: serverMessageData[0].message_type,
          showMessage: serverMessageData[0].show_message,
        })
      })
      .catch((err) => {
        console.log(err)
        Logger.writeLog('SKT_001', 'Something went wrong with the socket(s)', err, false)
      })
    }, 1000)
  }

module.exports = socketCtrl