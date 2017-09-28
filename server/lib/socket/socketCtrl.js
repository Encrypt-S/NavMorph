socketIo =  require('socket.io')
serverModeCtrl = require('../db/serverMode.ctrl')


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
      } catch (e) {
        reject(e)
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
        socket.emit('server-message', {
          serverMessage: serverMessageData[0].server_message,
          serverMessageType: serverMessageData[0].message_type,
          showMessage: serverMessageData[0].show_message,
        })
      })
    }, 1000)
  }

module.exports = socketCtrl