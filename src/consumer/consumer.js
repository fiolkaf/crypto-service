import uuid from 'uuid'
import amqp from 'amqplib'
import RMQConsumer from './rmq-consumer'
import RMQProducer from './rmq-producer'
import CryptoService from '../services/crypto-service'

export default class Consumer {
  constructor ({ server, encryptionKey }) {
    this.server = server
    this.cryptoService = new CryptoService({ key: encryptionKey })
  }

  async start () {
    this.connection = await amqp.connect(`amqp://${this.server}`)

    this.producer = new RMQProducer({
      connection: this.connection,
      queue: 'crypto_out'
    })
    await this.producer.start()

    this.consumer = new RMQConsumer({
      connection: this.connection,
      queue: 'crypto_in'
    })
    this.consumer.on('message', data => this._handler(data))
    await this.consumer.start()
  }

  stop () {
    this.connection && this.connection.stop()
  }

  _handler ({ id, type, data }) {
    const result = this.cryptoService[type](data)
    this.producer.send({
      id: uuid.v4(),
      type,
      correlationId: id,
      data: result
    })
  }
}
