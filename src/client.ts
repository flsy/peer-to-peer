import {RawData} from "ws";
import WebSocket from 'ws';

export const client = (port: number) => {
  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', function open() {
    console.log(`Connected to peer on port: ${port}`)
    ws.send('Hello from client');
  });

  ws.on('message', function message(data: RawData) {
    console.log('received: %s', data);
  });

  ws.on('close', () => {
    console.log(`Server disconnected on port: ${port}`)
  })
}
