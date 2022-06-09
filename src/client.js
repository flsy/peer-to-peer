const WebSocket = require('ws')

const client = (port) => {
  const ws = new WebSocket(`ws://localhost:${port}`);
  console.log('Client start')

  ws.on('open', function open() {
    ws.send('Hello from client');
  });

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.on('close', () => {
    console.log('Server disconnected')
  })
}

 module.exports = { client }
