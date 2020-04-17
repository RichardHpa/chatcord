const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', socket => {
    // console.log('new web socket connection');

    // This will emit to only the user who connects
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcasts when a user connects
    // This will emit to everyone except the user you connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    // Runs when a user disconnects
    socket.on('disconnect', () => {
        // this will emit to every user
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        io.emit('message', formatMessage('USER',msg));
    });


});

const PORT =  process.env.port || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
