# blockchain-driver

# This repo is deprecated: it has been moved [here](https://github.com/joemphilips/walletts/tree/master/packages/blockchain-driver)

Cycle.js driver for following blockchain clients

* [bitcoind](https://github.com/bitcoin/bitcoin)
* [bcoin](https://github.com/bcoin-org/bcoin) ... WIP
* [bitcore-wallet-service (bws)](https://github.com/bitpay/bitcore-wallet-service) 

## Example

```ts
import { makeTrustedBitcoindDriver } from 'blockchain-driver'
import { run } from '@cycle/run'

const blockchainDriver = makeTrustedBitcoindDriver({username: "foo", password: "bar", port: 18332})

run(main, {Blockchain: blockchainDriver})
```

## contributing

To run integration test, you must first run `docker-compose up` and 
`yarn integration`

bws test suite creates new wallet (and puts its pubkey onto the server) each time it runs.
But since a bws has a cap for its wallet number able to create from same ip,
you may have to re-run docker by `docker-compose down && docker-compose up`
