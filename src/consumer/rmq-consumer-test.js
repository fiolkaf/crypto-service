import RMQConsumer from './rmq-consumer'

const message = {
  content: Buffer.from(JSON.stringify({ test: true }))
}
const channel = {
  assertQueue: sinon.stub(),
  ack: sinon.stub(),
  consume: (queue, handler) => handler(message)
}
const connection = {
  createChannel: sinon.stub().resolves(channel)
}

describe('RMQConsumer', () => {
  let expectedPayload
  before(async () => {
    const consumer = new RMQConsumer({
      connection,
      queue: 'queue'
    })
    consumer.on('message', payload => {
      expectedPayload = payload
    })

    await consumer.start()
  })

  it('sends message ack', () => {
    expect(channel.ack.calledWith(message), 'to be true')
  })

  it('emits event on message', () => {
    expect(expectedPayload, 'to equal', { test: true })
  })
})
