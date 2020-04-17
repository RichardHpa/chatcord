const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const { userJoin, getCurrentUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', socket => {
    // console.log('new web socket connection');

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // This will emit to only the user who connects
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcasts when a user connects
        // This will emit to everyone except the user you connects
        socket.to(user.room).broadcast.emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // Runs when a user disconnects
        socket.on('disconnect', () => {
            // this will emit to every user
            io.emit('message', formatMessage(botName, `${user.username} has left the chat`));
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        io.emit('message', formatMessage('USER',msg));
    });


});

const PORT =  process.env.port || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
