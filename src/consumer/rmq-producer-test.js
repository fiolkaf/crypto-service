import sinon from 'sinon'
import RMQProducer from './rmq-producer'

const channel = {
  assertQueue: sinon.stub(),
  sendToQueue: sinon.stub()
}
const connection = {
  createChannel: sinon.stub().resolves(channel)
}
const payload = {
  data: 'test'
}

describe('RMQProducer', () => {
  before(async () => {
    const producer = new RMQProducer({
      connection,
      queue: 'queue'
    })
    await producer.start()
    producer.send({ data: 'test' })
  })

  it('sends serialized JSON payload', () => {
    const buffer = Buffer.from(JSON.stringify(payload))
    expect(channel.sendToQueue.calledWith('queue', buffer), 'to be true')
  })
})
