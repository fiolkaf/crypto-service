import uuid from 'uuid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import amqp from 'amqplib'
import { EventEmitter } from 'events'

const rmqProducer = {
  start: sinon.stub(),
  send: sinon.stub()
}
class RMQConsumer extends EventEmitter {
  start () {}
}
const cryptoService = {
  encrypt: sinon.stub(),
  decrypt: sinon.stub()
}
const rmqConsumer = new RMQConsumer()

const { default: Consumer } = proxyquire('./consumer', {
  './rmq-producer': {
    default: function () {
      return rmqProducer
    }
  },
  './rmq-consumer': {
    default: function () {
      return rmqConsumer
    }
  },
  '../services/crypto-service': {
    default: function () {
      return cryptoService
    }
  }
})
const channel = {
  consume: sinon.stub(),
  assertQueue: sinon.stub(),
  sendToQueue: sinon.stub()
}
const connection = {
  createChannel: sinon.stub().resolves(channel)
}

describe('Consumer', () => {
  let consumer
  before(async () => {
    sinon.stub(uuid, 'v4').returns('uuid')
    sinon.stub(amqp, 'connect').resolves(connection)

    consumer = new Consumer({
      server: 'test-server',
      encryptionKey: '12345678901234567890123456789012'
    })
    await consumer.start()
  })

  after(() => {
    amqp.connect.restore()
    uuid.v4.restore()
  })

  describe('encrypt', () => {
    before(() => {
      cryptoService.encrypt.returns('encrypted')
      rmqConsumer.emit('message', {
        id: 'msg1',
        type: 'encrypt',
        data: 'input'
      })
    })

    it('produces message with encrypted data', () => {
      expect(rmqProducer.send.calledWith({
        id: 'uuid',
        type: 'encrypt',
        correlationId: 'msg1',
        data: 'encrypted'
      }), 'to be true')
    })
  })

  describe('decrypt', () => {
    before(() => {
      cryptoService.decrypt.returns('decrypted')
      rmqConsumer.emit('message', {
        id: 'msg2',
        type: 'decrypt',
        data: 'input'
      })
    })

    it('produces message with decrypt data', () => {
      expect(rmqProducer.send.calledWith({
        id: 'uuid',
        type: 'decrypt',
        correlationId: 'msg2',
        data: 'decrypted'
      }), 'to be true')
    })
  })
})
