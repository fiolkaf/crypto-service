import crypto from 'crypto'

export default class Crypto {
  constructor ({ algorithm = 'aes-256-cbc', key, ivLength = 16 }) {
    this.algorithm = algorithm
    this.key = key
    this.ivLength = ivLength
  }

  encrypt (text) {
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv)

    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    encrypted = iv.toString('hex') + ':' + encrypted.toString('hex')

    return Buffer.from(encrypted).toString('base64')
  }

  decrypt (cipher) {
    const cipherDecoded = Buffer.from(cipher, 'base64').toString()

    let [iv, encrypted] = cipherDecoded.split(':')

    const ivBuffer = Buffer.from(iv, 'hex')
    encrypted = Buffer.from(encrypted, 'hex')

    const decipher = crypto
      .createDecipheriv(this.algorithm, Buffer.from(this.key), ivBuffer)

    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  }
}
