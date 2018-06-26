import debug from 'debug'
import { EventEmitter } from 'events'

const log = debug('crypto-service:rmq-consumer')

export default class RMQConsumer extends EventEmitter {
  constructor ({ queue, connection }) {
    super()
    this.queue = queue
    this.channel = null
    this.connection = connection
  }

  async start () {
    this.channel = await this.connection.createChannel()
    await this.channel.assertQueue(this.queue, { durable: false })
    this.channel.consume(this.queue, message => this._handler(message))
  }

  _handler (message) {
    const content = Buffer.from(message.content).toString()
    const payload = JSON.parse(content)
    log(`incomming message ${payload.id}`)
    this.emit('message', payload)
    this.channel.ack(message)
  }
}
