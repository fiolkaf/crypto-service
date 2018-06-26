export default class CryptoController {
  static encrypt (req, res) {
    const { cryptoService, body } = req
    const result = cryptoService.encrypt(body)

    res.send(result)
  }

  static decrypt (req, res) {
    const { cryptoService, body } = req
    const result = cryptoService.decrypt(body)

    res.send(result)
  }
}
