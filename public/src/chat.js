const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
});

const chatContainer = document.getElementById('chat');
const addMessageToList = function addMessageToList(message) {
  const li = document.createElement('li');
  li.innerHTML = message;
  chatContainer.appendChild(li);
};

socket.on('chat:connected', (username) => {
  addMessageToList(`<i>${username}</i> connected`);
});
socket.on('chat:messaged', ({ username, message }) => {
  addMessageToList(`<i>${username}</i>: ${message}`);
});

const connectBtn = document.getElementById('connect');
const sendBtn = document.getElementById('send');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');

connectBtn.addEventListener('click', () => {
  socket.open();
  socket.emit('chat:connect', {
    username: usernameInput.value
  });
  connectBtn.setAttribute('disabled', 'disabled');
  usernameInput.setAttribute('disabled', 'disabled');
  sendBtn.removeAttribute('disabled');
  messageInput.removeAttribute('disabled');
}, false);

sendBtn.addEventListener('click', () => {
  socket.emit('chat:message', {
    message: messageInput.value
  });
});
