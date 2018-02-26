const serverModeCtrl = require('../db/serverMode.ctrl')
const Logger = require('../logger')


const SocketCtrl = {}

SocketCtrl.setupServerSocket = (socket) => {
  try {
    socket.on('connection', function(socket){
      console.log('a user connected')
      socket.on('disconnect', function(){
        console.log('USER DISCONNECTED')
      })
      socket.on('ADD_MESSAGE', (message) => {
        socket.emit('MESSAGE', { type: 'NEW_MESSAGE', text: message })
      })
    })
    SocketCtrl.startDbWatch(socket)
    return true
  } catch (err) {
    throw err
  }
}

SocketCtrl.startDbWatch = async (socket) => {
  let previousMode
  let previousMessage
  setInterval(async () => {
   try {
     const currServerMode = await serverModeCtrl.checkMode()
      if (currServerMode.length === 1 && previousMode !== currServerMode) {
        previousMode = currServerMode
        socket.emit('SERVER_MODE', currServerMode[0].server_mode)
      }
      const currServerMessageData = await serverModeCtrl.checkMessage()
      if (currServerMessageData.length === 1 && previousMessage !== currServerMessageData) {
        previousMessage = currServerMessageData
        socket.emit('SERVER_MESSAGE', {
          serverMessage: currServerMessageData[0].server_message,
          serverMessageType: currServerMessageData[0].message_type,
          showMessage: currServerMessageData[0].show_message,
        })
      }
      Logger.writeLog('SKT_001', 'Something went wrong with the socket(s)', { error: err }, false)
    } catch(err) {
    }
  }, 1000)
}

module.exports = SocketCtrl
