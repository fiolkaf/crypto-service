import debug from 'debug'
import express from 'express'
import bodyParser from 'body-parser'
import CryptoController from './crypto-controller'
import CryptoService from '../services/crypto-service'

const log = debug('crypto-service:http-server')

export default class HttpServer {
  constructor ({ encryptionKey, port }) {
    this.port = port || 80
    this.app = express()
    this.app.use((req, res, next) => {
      log(`${req.method} ${req.url}`)
      req.cryptoService = new CryptoService({ key: encryptionKey })
      next()
    })
    this.app.use(bodyParser.text())

    this.app.post('/encrypt', CryptoController.encrypt)
    this.app.post('/decrypt', CryptoController.decrypt)
  }

  start () {
    this.server = this.app.listen(this.port)
    return this.server
  }

  stop () {
    this.server.close()
  }
}
