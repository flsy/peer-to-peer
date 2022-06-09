const { server } = require('./server')
const { client } = require('./client')

const existingPeerPort = process.env['EXISTING_PEER_PORT']
const newPeerPort = process.env['NEW_PEER_PORT']

if (!newPeerPort) {
  throw new Error('No port defined!')
}

const start = async () => {
  await server(newPeerPort)
  if (existingPeerPort) {
    await client(existingPeerPort)
  }
}

start()
