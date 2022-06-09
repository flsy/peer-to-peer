import { server } from './server'
import { client } from './client'

const port = Number(process.env['PORT'])
const peers = process.env['PEERS']

if (!port) {
  throw new Error('No port defined!')
}
const trim = (value: string): string => value.trim()
const toNumber = (value: string): number => Number(value)
const getPeerPorts = (peers: string): number[] => peers.split(',').map(trim).map(toNumber)

const start = async () => {
  await server(port)
  if (peers) {
    await Promise.all(getPeerPorts(peers).map(async (peerPort) => await client(peerPort)))
  }
}

start()
