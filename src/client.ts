import WebSocket, { RawData } from 'ws';

export const client = (port: number) => {
  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', () => {
    console.log(`Connected to peer ws://localhost:${port}`)
    ws.send('Hello from client');
  });

  ws.on('message', (data: RawData) => {
    console.log(`New message from ws://localhost:${port} data=${data.toString()}`);
  });

  ws.on('close', () => {
    console.log(`Disconnected from peer ws://localhost:${port}`)
  })
}
