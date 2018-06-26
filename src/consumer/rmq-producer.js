import debug from 'debug'

const log = debug('crypto-service:rmq-producer')

export default class RMQProducer {
  constructor ({ connection, queue }) {
    this.connection = connection
    this.queue = queue
  }

  async start () {
    this.channel = await this.connection.createChannel()
    this.channel.assertQueue(this.queue, { durable: false })
  }

  send (message) {
    log(`outgoing message ${message.id}`)
    const payload = JSON.stringify(message)
    this.channel.sendToQueue(this.queue, Buffer.from(payload))
  }
}
