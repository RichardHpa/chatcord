const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from querySelector
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Message form server
socket.on('message', message => {
    console.log(message);

    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the message from the input field
    const msg = e.target.elements.msg.value;

    // Emit the message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})


// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}
