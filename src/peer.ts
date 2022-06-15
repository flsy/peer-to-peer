import { Socket, createServer } from 'net';
import { EventEmitter } from 'events';

interface IPeer<Message> {
    /**
     * Broadcast a message
     * @param message
     */
    send: (message: Message) => void;
    /**
     * Receive message
     * @param message
     */
    onReceived: (callback: (message: Message) => void) => void;
}

interface IConfig {
    port: number;
    peers?: number[];
}
const peer = (config: IConfig): Promise<IPeer<IMessage>> => new Promise((resolve) => {

    let connections: Array<{ port: number, socket: Socket }> = [];

    setInterval(() => {
        console.log(`connected to="${connections.map(c => c.port).join(', ')}"`)
    }, 1000)

    const emitter = new EventEmitter();

    emitter.on('connect-to', (data: { port: number }) => {
        if (connections.find(conn => conn.port === data.port)) {
            console.log(`connection to port="${data.port}" already exists`)
            return;
        }


        const socket = new Socket();
        const port = data.port
        console.log('about to connect to', { port })

        socket.connect(port, '0.0.0.0',() => {
            console.log('connected to', { port });

            connections.push({ port, socket })

            socket.write(Buffer.from(JSON.stringify({ type: 'new-peer', port: config.port })), () => {
                console.log('client: a init message sent to ', { port: config.port })
            })

            socket.on('close', () => {
                console.log('connection close', { port })
                connections = connections.filter(conn => conn.port !== port)
            });
        });
    })

    emitter.on('send', (data: IMessage) => {
        connections.forEach(socket => {
            socket.socket.write(Buffer.from(JSON.stringify(data)), () => {
                console.log(socket.port, 'client: a message sent')
            })
        })
    })

    emitter.on('received', (data: IMessage) => {
        if (data.type === 'new-peer') {
            emitter.emit('connect-to', { port: data.port })
        }
    })

    createServer((socket) => {
        socket.on('close', () => {
            console.log('server: peer disconnected')
        });

        socket.on('data', (data) => {
            const message: IMessage = JSON.parse(data.toString());
            console.log(`server: message received`, message)
            emitter.emit('received', message)
        });

    }).listen(config.port,'0.0.0.0', async () => {
        console.log('server: running peer on', { port: config.port });

        (config.peers || []).forEach(peer => {
            emitter.emit('connect-to', { port: peer })
        })

        return resolve({
            send: (message) => emitter.emit('send', message),
            onReceived: (fn) => emitter.on('received', fn)
        })

    });
})

type IMessage = { type: 'new-peer', port: number };

const config: IConfig = {
    port: parseInt(process.env.PORT as string, 10),
    peers: process.env.PEERS?.split(',').map(peer => parseInt(peer as string, 10))
}
peer(config).then(instance => {
    // instance.onReceived((message) => console.log({ message }));
    // instance.send({ type: 'new-peer', port: config.port });
})

