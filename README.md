# blockchain-driver

Cycle.js driver for following blockchain

* bitcoind
* bcoin
* bitcore-wallet-service (bws)


## for developer

To run test, you must first run `docker-compose up`
test suite creates new wallet each time for the bws, and the bws has a cap for wallet number able to create from same ip,
you may have to re-run docker by `docker-compose down && docker-compose up`
