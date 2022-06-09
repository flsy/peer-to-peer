import WebSocket, {WebSocketServer} from 'ws'

export const server = (port: number) => new Promise((resolve, reject) => {
  const wss = new WebSocketServer({
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
    console.log(`Peer started on port: ${port}`)
    resolve(true)
  })

  wss.on('error', (error) => reject(error))

  wss.on('connection', (ws, req) => {
    ws.on('message', (data) => {
      console.log(`Message received from="${req.socket.remoteAddress}" content="${data}"`);
    });

    ws.on('close', (reasonCode, description) => {
      console.log('Client disconnected', reasonCode, description.toString())
      resolve(true);
    })

    ws.send(`Init message from server: ws://localhost:${port}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('New client connected');
      }
    });
  });
})
