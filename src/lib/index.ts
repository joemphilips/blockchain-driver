/* tslint:disable:no-submodule-imports */
/* tslint:disable:no-empty */
import { adapt } from '@cycle/run/lib/adapt';
import Client, { BatchOption, ClientConstructorOption } from 'bitcoin-core';
import xs, { Stream } from 'xstream';

export interface BlockchainAgentOptionBase {
  readonly url: string;
}

export type BitcoindRPCRequest = BatchOption;

export interface BitcoindAgentOption extends BlockchainAgentOptionBase {
  readonly port: number;
  readonly password: string;
}

// TODO: Specify type for sink correctly
export const makeTrustedBitcoindDriver = (
  clientConstructorOpt?: ClientConstructorOption
) => {
  const trustedBitcoindDriver = (request$: Stream<BitcoindRPCRequest>) => {
    const client = new Client(clientConstructorOpt ? clientConstructorOpt : {});
    const response$$ = xs.create();

    // TODO: buffer stream and send request with real batch
    request$.subscribe({
      next: async outgoing => {
        /* tslint:disable-next-line:no-expression-statement */
        const response$ = xs.fromPromise(client.command([outgoing]));
        /* tslint:disable-next-line:no-expression-statement */
        response$$.shamefullySendNext(response$);
      },
      error: () => {},
      complete: () => {}
    });

    return adapt(response$$);
  };

  return trustedBitcoindDriver;
};
