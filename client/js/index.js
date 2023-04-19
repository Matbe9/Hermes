let socket = io();

function getCookie(name){
    const pattern = RegExp(name + "=.[^;]*");
    const matched = document.cookie.match(pattern);
    if(matched){
        const cookie = matched[0].split('=');
        return cookie[1]
    }
    return false
}

socket.on('connect', function() {
    socket.emit('login', {userToken: getCookie('token')});
});
socket.on('message', (data) => {
    addMessage(data.content, data.time + ' • ' + data.author, data.isMine);
})
socket.on('redirect', (destination) => {
    window.location.href = destination;
});
socket.on('login-error', (data) => {
    console.log(data);
   if (data.code === 404 && data.name === 'User Not Found'){
       alert('http://'+data.cerbere_fqdn+'/auth/hermes');
       window.location.href = `http://${data.cerbere_fqdn}/auth/hermes`;
   }
});

addEventListener('submit', (event) => {
    event.preventDefault();
    const messageInput = document.getElementById('message-input')


    const msg = {
        content: messageInput.value,
    }
    if (msg !== '') {
        socket.emit('message', msg);
        messageInput.value = '';
    }
});


function addMessage(content, time, isMine){
    const messageFeed = document.getElementById('message-feed');
    const messageElement = document.createElement('p');

    messageElement.setAttribute('class', isMine ? 'message message-me' : 'message');

    const messageTime = document.createElement('p');
    messageTime.setAttribute('class', 'message-time');
    messageTime.innerText = time;

    const messageContent = document.createElement('p');
    messageContent.setAttribute('class', 'message-content');
    messageContent.innerText = content;

    messageElement.appendChild(messageTime);
    messageElement.appendChild(messageContent);

    messageFeed.appendChild(messageElement);
    messageFeed.scrollTo(0, messageFeed.scrollHeight);
}