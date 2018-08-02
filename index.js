const express = require('express');
const path = require('path');
const drawingRoutes = require('./routes/drawing.js');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

function test() {
  console.log(123);
}
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(drawingRoutes);

app.get('/test', (req, res) => {
  test();
  res.json({ ok: true });
});

// websocket connection
io.on('connection', (socket) => {
  console.log('user connected');
  let myUsername;
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat:connect', ({ username }) => {
    myUsername = username;
    console.log('username: ' + username);
    io.emit('chat:connected', username);
  });
  socket.on('chat:message', ({ message }) => {
    console.log('message: ' + message);
    io.emit('chat:messaged', { username: myUsername, message });
  });
});

http.listen(3000, () => console.log('Example app listening on port 3000!'));
