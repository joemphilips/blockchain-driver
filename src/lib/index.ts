import Client from 'bitcoin-core';
import xs ,{Stream} from 'xstream'

export interface BlockchainAgentOptionBase {
    readonly url: string
}

export interface BitcoindAgentOption extends BlockchainAgentOptionBase {
    readonly port: number,
    readonly password: string,
}

export const makeTrustedBitcoindDriver = (agentOption: BitcoindAgentOption) => {
  const trustedBitcoindDriver = (request$: Stream<BitcoindAgentOption>) => {
    const client = new Client();
    request$.addListener({
      next: outgoing => {
        /* tslint:disable-next-line:no-expression-statement */
        client.ping();
      }
    });
  };
};

export const makeTrustedBcoinDriver = (sources) => {
  
}