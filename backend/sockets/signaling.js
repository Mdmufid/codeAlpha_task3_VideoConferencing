// === backend/sockets/signaling.js ===
const roomUsers = {}; // Track users in rooms

module.exports = function (io) {
  io.on('connection', socket => {
    console.log('User connected:', socket.id);
    socket.on('draw', data => {
  socket.broadcast.emit('draw', data);
});

    socket.on('join-room', roomId => {
      socket.join(roomId);

      if (!roomUsers[roomId]) roomUsers[roomId] = [];
      roomUsers[roomId].push(socket.id);

      const otherUsers = roomUsers[roomId].filter(id => id !== socket.id);
      otherUsers.forEach(id => {
        socket.emit('user-joined', id);       // Tell current user about others
        io.to(id).emit('user-joined', socket.id); // Tell existing users about new one
      });
    });

    socket.on('signal', data => {
      io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });
    socket.on('file-share', data => {
  socket.broadcast.emit('file-share', data);
});


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const roomId in roomUsers) {
        roomUsers[roomId] = roomUsers[roomId].filter(id => id !== socket.id);
        io.to(roomId).emit('user-disconnected', socket.id);
      }
    });
  });
};
