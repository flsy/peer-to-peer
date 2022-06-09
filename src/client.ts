import WebSocket, { RawData } from 'ws';

export const client = (port: number) => {
  const server = new WebSocket(`ws://localhost:${port}`);

  server.on('open', () => {
    console.log(`Connected to peer ws://localhost:${port}`)
    server.send('Hello from client');
  });

  server.on('message', (data: RawData) => {
    console.log(`New message from ws://localhost:${port} data=${data.toString()}`);
  });

  server.on('close', () => {
    console.log(`Disconnected from peer ws://localhost:${port}`)
  })
}
