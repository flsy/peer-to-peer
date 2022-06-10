import { server } from './server'
import { client } from './client'
import {IConfig} from "./interfaces";
import {getPeerPorts} from "./utils";

const peer = async (config: IConfig) => {
  await server(config.port);
  await Promise.all(config.peers.map(async (peerPort) => await client(peerPort)))
}

const main = () => {
  const port = Number(process.env['PORT'])
  const peers = process.env['PEERS']

  if (!port) {
    throw new Error('No port defined!')
  }


  peer({
    port,
    peers: getPeerPorts(peers)
  });

}

main()
