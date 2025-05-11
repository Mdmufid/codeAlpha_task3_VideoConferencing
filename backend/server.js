const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const initSocket = require('./sockets/signaling');

const server = http.createServer(app);
const io = new Server(server);

initSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));