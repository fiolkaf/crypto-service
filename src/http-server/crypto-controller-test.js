import CryptoController from './crypto-controller'
import { mockRes } from 'sinon-express-mock'

describe('crypto-controller', () => {
  describe('encrypt', () => {
    const res = mockRes()
    const cryptoService = {
      encrypt: sinon.stub()
    }

    before(() => {
      cryptoService.encrypt.returns('encrypted')
      CryptoController.encrypt({
        body: 'input',
        cryptoService
      }, res)
    })

    it('returns encrypted text', () => {
      expect(res.send.calledWith('encrypted'), 'to be true')
    })
  })

  describe('decrypt', () => {
    const res = mockRes()
    const cryptoService = {
      decrypt: sinon.stub()
    }

    before(() => {
      cryptoService.decrypt.returns('decrypted')
      CryptoController.decrypt({
        body: 'input',
        cryptoService
      }, res)
    })

    it('returns decrypted text', () => {
      expect(res.send.calledWith('decrypted'), 'to be true')
    })
  })
})
