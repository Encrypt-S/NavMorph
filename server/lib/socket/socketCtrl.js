socketIo =  require('socket.io')


socketCtrl = {}

  socketCtrl.setupTestSocket = (socket) => {
    return new Promise(fufill, reject) => {    
      try {
        socket.on('connection', function(socket){
          console.log('a user connected');
          socket.on('disconnect', function(){
            console.log('USER DISCONNECTED');
          });
          socket.on('add-message', (message) => {
            socket.emit('message', {type:'new-message', text: message});
          });
        })
        fufill()
      } catch (e) {
        reject(e)
      }
    }
  }

module.exports = socketCtrl