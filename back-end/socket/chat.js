module.exports = function (io) {
  let connectedUsers = []
  let messages = []

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    connectedUsers.push(socket.id)
    console.log(connectedUsers);
    io.emit('notification', { type: 'new_user', data: socket.id });
    io.emit('history', messages)

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      connectedUsers = connectedUsers.filter(x => x != socket.id)
      io.emit('notification', { type: 'removed_user', data: socket.id });
      console.log(connectedUsers);
    });

    socket.on('pushMessage', (msg) => {
      socket.emit('notification', msg)
      socket.emit('message', msg)
      messages.push(msg)
    });
  })
}