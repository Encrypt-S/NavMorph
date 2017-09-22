socketIo =  require('socket.io')
serverModeCtrl = require('../db/serverMode.ctrl')


socketCtrl = {}
    
  socketCtrl.setupServerModeSocket = (socket) => {
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
        socketCtrl.startServerModeWatch(socket)
        fufill()
      } catch (e) {
        reject(e)
      }
    })
  }

  socketCtrl.startServerModeWatch = (socket) => {
    setInterval(() => {
      serverModeCtrl.checkMode()
      .then((mode) => {
        socket.emit('SERVER_MODE', mode[0].server_mode)
      })
    }, 1000)
  }

module.exports = socketCtrl