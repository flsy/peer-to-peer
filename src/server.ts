import WebSocket, {WebSocketServer} from 'ws'
import {v4} from "uuid";

export const server = (port: number) => new Promise((resolve, reject) => {
  const server = new WebSocketServer({
    port,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed if context takeover is disabled.
    }
  }, () => {
    console.log('Peer started on port:', port)
    resolve(true)
  })

  server.on('error', (error) => reject(error))

  server.on('connection', (client, req) => {
    // @ts-ignore
    client["id"] = v4();
    client.on('message', (data) => {
      console.log(`Message received from="${req.socket.remoteAddress}" content="${data}"`);
    });

    client.on('close', (reasonCode, description) => {
      console.log('Client disconnected', reasonCode, description.toString())
      resolve(true);
    })

    const clientIds: string[] = [];
    server.clients.forEach((client) => {
      // @ts-ignore
      clientIds.push(client.id)
    });

    console.log('Client connected')

    client.send(`Init message from server: ws://localhost:${port}, ${JSON.stringify({clientIds})}`);

    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('New client connected');
      }
    });
  });
})
