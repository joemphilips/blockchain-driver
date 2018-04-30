import { adapt } from '@cycle/run/lib/adapt';
import { default as Client } from 'bitcore-wallet-client';
import * as util from 'util';
import xs, { MemoryStream, Stream } from 'xstream';
import { BlockchainAgentOptionBase } from './common';

export interface BWSClientOption extends BlockchainAgentOptionBase {
  readonly xIdentity?: string;
  readonly xSignature?: string;
  readonly apiBase?: string;
}

export interface BWSRequest {
  readonly method: keyof Client;
  readonly options?: ReadonlyArray<any>;
}

export interface BWSResponse {
  readonly [key: string]: any;
}

export const makeBWSDriver = ({ url }: BWSClientOption) => {
  const BWSDriver = (
    request$: Stream<BWSRequest>
  ): MemoryStream<BWSResponse> => {
    const cli = new Client({ baseUrl: url + '/bws/api', timeout: 3000 });
    const response$ = request$
      .map(r => xs.fromPromise(util.promisify(cli[r.method]).bind(cli)()))
      .flatten();
    return adapt(response$);
  };
  return BWSDriver;
};
