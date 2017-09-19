socketIo =  require('socket.io')
serverModeCtrl = require('../db/serverMode.ctrl')


socketCtrl = {}
  socketCtrl.testSocketLoop = true

  socketCtrl.setupTestSocket = (socket) => {
    return new Promise((fufill, reject) => {    
      try {
        // socket.on('connection', function(socket){
        //   console.log('a user connected')
        //   socket.on('disconnect', function(){
        //     console.log('USER DISCONNECTED')
        //   })
        //   socket.on('add-message', (message) => {
        //     socket.emit('message', {type:'new-message', text: message})
        //   })
        // })
        fufill()
      } catch (e) {
        reject(e)
      }
    })
  }

  socketCtrl.setupServerModeSocket = (socket) => {
    return new Promise((fufill, reject) => {    
      try {
        socket.on('connection', function(socket){
          console.log('a user connected')
          socket.on('disconnect', function(){
            console.log('USER DISCONNECTED')
          })
          socket.on('add-message', (message) => {
            socket.emit('message', {type:'new-message', text: message})
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
        socket.emit('server-mode', mode[0].server_mode)
      })
    }, 1000)
  }

module.exports = socketCtrl