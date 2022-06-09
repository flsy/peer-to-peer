const WebSocket = require('ws')

const client = (port) => {
  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', function open() {
    console.log(`Connected to peer on port: ${port}`)
    ws.send('Hello from client');
  });

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.on('close', () => {
    console.log(`Server disconnected on port: ${port}`)
  })
}

 module.exports = { client }
