socketIo =  require('socket.io')


socketCtrl = {}
  socketCtrl.testSocketLoop = true

  socketCtrl.setupTestSocket = (socket) => {
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
        socketCtrl.startWatch(socket)
        fufill()
      } catch (e) {
        reject(e)
      }
    })
  }

  socketCtrl.startWatch = (socket) => {
    setInterval(() => {
      if (socketCtrl.testSocketLoop) {
        //socket.emit('message', {type:'new-message', text: new Date().toString()})
      }
    }, 1000, socketCtrl.testSocketLoop)
  }

module.exports = socketCtrl