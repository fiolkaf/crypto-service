import HttpServer from './http-server/http-server'
import Consumer from './consumer/consumer'

const encryptionKey = process.env.ENCRYPTION_KEY
if (!encryptionKey) {
  throw new Error('ENCRYPTION_KEY environment variable must be defined')
}
const rmqServer = process.env.RMQ_ADDRESS || 'localhost'
if (!rmqServer) {
  throw new Error('RMQ_ADDRESS environment variable must be defined')
}

const httpServer = new HttpServer({ encryptionKey, port: process.env.HTTP_PORT || 8088 })
httpServer.start()

const consumer = new Consumer({ server: rmqServer, encryptionKey })
consumer.start()

process.on('unhandledRejection', (ex) => {
  httpServer.stop()
  consumer.stop()
})

process.on('exit', () => {
  httpServer.stop()
  consumer.stop()
})
