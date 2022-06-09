const { server } = require('./server')
const { client } = require('./client')

const port = process.env['PORT']
const peers = process.env['PEERS']

if (!port) {
  throw new Error('No port defined!')
}
const trim = (value) => value.trim()
const getPeers = (peers) => peers.split(',').map(trim)

const start = async () => {
  await server(port)
  if (peers) {
    await Promise.all(getPeers(peers).map(async (peerPort) => await client(peerPort)))
  }
}

start()
