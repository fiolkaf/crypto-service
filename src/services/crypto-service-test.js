import CryptoService from './crypto-service'
import crypto from 'crypto'

describe('crypto-service', () => {
  before(() => sinon.stub(crypto, 'randomBytes').returns(Buffer.from('1234567890123456')))

  after(() => crypto.randomBytes.restore())

  const cryptoService = new CryptoService({
    key: '12345678901234567890123456789012'
  })

  describe('encrypt', () => {
    let result
    before(() => {
      result = cryptoService.encrypt('input')
    })

    it('encrypts string', () => {
      expect(result, 'to equal', 'MzEzMjMzMzQzNTM2MzczODM5MzAzMTMyMzMzNDM1MzY6OTQwNWQ4ZmViOTk2NGExZDNhMzdkODQ3NDQ4OWRlYTI=')
    })
  })

  describe('decrypt', () => {
    let result
    before(() => {
      result = cryptoService.decrypt('MzEzMjMzMzQzNTM2MzczODM5MzAzMTMyMzMzNDM1MzY6OTQwNWQ4ZmViOTk2NGExZDNhMzdkODQ3NDQ4OWRlYTI=')
    })

    it('decrypts string', () => {
      expect(result, 'to equal', 'input')
    })
  })
})
