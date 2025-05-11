// frontend/js/socket.js
const socket = io();

// Parse roomId from query string
const params = new URLSearchParams(window.location.search);
const roomId = params.get('roomId');
if (!roomId) {
  alert('No Room ID specified. Please go back and join/create a room.');
  throw new Error('Missing roomId');
}

// Tell the server which room we want
socket.emit('join-room', roomId);

// The rest of your existing handlers stay the same:
socket.on('user-joined', userId => { /* … */ });
socket.on('signal', data => { /* … */ });
socket.on('draw', data => { /* … */ });
socket.on('file-share', data => { /* … */ });
socket.on('user-disconnected', id => { /* … */ });
