import request from 'supertest'
import CryptoController from './crypto-controller'
import HttpServer from './http-server'

describe('HttpServer', () => {
  let server
  let app
  before(() => {
    sinon.stub(CryptoController, 'encrypt')
      .callsFake((req, res, next) => {
        res.send('encrypted')
        next()
      })

    sinon.stub(CryptoController, 'decrypt')
      .callsFake((req, res, next) => {
        res.send('decrypted')
        next()
      })

    server = new HttpServer({
      encryptionKey: '1234567890123456',
      port: 8083
    })

    app = server.start()
  })

  after(() => server.stop())

  describe('POST /encrypt', () => {
    let response

    before(async () => {
      response = await request(app)
        .post('/encrypt')
    })

    it('returns status code 200', () => {
      expect(response.status, 'to equal', 200)
    })

    it('returns encrypted text', () => {
      expect(response.text, 'to equal', 'encrypted')
    })
  })

  describe('POST /decrypt', () => {
    let response

    before(async () => {
      response = await request(app)
        .post('/decrypt')
    })

    it('returns status code 200', () => {
      expect(response.status, 'to equal', 200)
    })

    it('returns decrypted text', () => {
      expect(response.text, 'to equal', 'decrypted')
    })
  })
})
