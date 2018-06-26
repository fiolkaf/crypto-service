# crypto-server

Encrypt API Server.

The server application supports two API protocols: REST HTTP and JSON over RabbitMQ.

Default `aes-256-cbc` algorithm uses 64 bit encryption key.

## How to use

```
npm i
npm start
```

Environment variables:
- `ENCRYPTION_KEY` - secret key used for the encryption `required`
- `HTTP_PORT` - http server port (8088)
- `RMQ_ADDRESS`- RabbitMQ server ('localhost')

Endpoints:
- `POST /decrypt` cipher
- `POST /encrypt` text

Message format:
- 'crypto_in' queue
```
{
  id,
  type, <encrypt/decrypt>
  data // text to encrypt/decrypt
}
```

- 'crypto_out' queue
```
{
  id,
  correlationId, // request message id
  type, <encrypt/decrypt>
  data // encrypted/decrypted text
}
```
