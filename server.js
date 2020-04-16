const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log('new web socket connection');
});

const PORT = 3000 || process.env.port;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
