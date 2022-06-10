import WebSocket, {WebSocketServer} from 'ws'

type StoredClient = {clientId: string; address: string; client: WebSocket;}
let clients: Array<StoredClient> = [];

export const server = (port: number) => new Promise((resolve, reject) => {
  const server = new WebSocketServer({
    port,
    clientTracking: true
  }, () => {
    console.log('Peer started on port:', port)
    resolve(true)
  })

  server.on('error', (error) => reject(error))

  server.on('connection', (client, req) => {
    console.log('new client connection')
    let current: StoredClient | undefined = undefined;
    client.on('message', (data) => {

      const message = JSON.parse(data.toString());
      if (message.type === 'connect') {
        current = { clientId: message.clientId, address: message.clientAddress, client }
        console.log(message.clientAddress, 'Connected')

        // append to client list
        clients.push(current);

        // broadcast new client list
        server.clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify({ type: 'client-list', clients: clients.map(c => c.address)}))
          }
        });
      } else {
        console.log(current?.address, `unknown message received from content="${data}"`);
      }
    });

    client.on('close', () => {
      console.log(current?.address, 'Disconnected')

      // update client list
      clients = clients.filter(c => current && c.clientId !== current.clientId)

      // broadcast new client list, exclude this current connection
      server.clients.forEach((c) => {
        if (c !== client && c.readyState === WebSocket.OPEN) {
          c.send(JSON.stringify({ type: 'client-list', clients: clients.map(c => c.address)}))
        }
      });
    })
  });
})
