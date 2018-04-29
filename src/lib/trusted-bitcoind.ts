/* tslint:disable:no-submodule-imports */
/* tslint:disable:no-empty */
import { adapt } from '@cycle/run/lib/adapt';
import Client, { BatchOption, ClientConstructorOption } from 'bitcoin-core';
import xs, { MemoryStream, Stream } from 'xstream';

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
  const trustedBitcoindDriver = (
    request$: Stream<BitcoindRPCRequest>
  ): MemoryStream<any> => {
    const client = new Client(clientConstructorOpt ? clientConstructorOpt : {});

    // TODO: buffer stream and send request with real batch
    const response$ = request$
      .map(command => xs.fromPromise(client.command([command])))
      .flatten();

    return adapt(response$);
  };

  return trustedBitcoindDriver;
};
