import WebSocket, { RawData } from 'ws';
import {v4} from "uuid";

const connection = async (address: string, onListUpdated: (list: string[]) => void, onDisconnected: () => void): Promise<WebSocket> => {
  const server = new WebSocket(address);

  server.on('open', () => {
    console.log(`Connecting to peer ${address}`)
    server.send(JSON.stringify({ type: 'connect', clientAddress: address, clientId: v4() }));
  });

  server.on('message', (data: RawData) => {
    const message = JSON.parse(data.toString());
    if (message.type === 'client-list') {
      console.log('peers clients:', message.clients)
      onListUpdated(message.clients)
    } else {
      console.log(`New unknown message from ${address} data=${data.toString()}`);

    }
  });

  server.on('close', () => {
    console.log(`Disconnected from peer ${address}`);
    onDisconnected()
  })

  return server
}

export const client = async (myAddress: string, initialPeers: string[]) => {
  // todo: keep list of peers up to date
  // const peers: Array<{ address: string; client: WebSocket }> = [];

  await Promise.all(initialPeers.map(async peer => await connection(peer, (list) => {
    console.log('todo: deal with new peer list:', list)
  }, () => {
    console.log('todo: deal with disconnected peer:', peer)

  })))
}
