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
    // console.log('new web socket connection');

    // This will emit to only the user who connects
    socket.emit('message', 'Welcome to ChatCord!');

    // Broadcasts when a user connects
    // This will emit to everyone except the user you connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    // Runs when a user disconnects
    socket.on('disconnect', () => {
        // this will emit to every user
        io.emit('message', 'A user has left the chat');
    })

});

const PORT = 3000 || process.env.port;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
