import { adapt } from '@cycle/run/lib/adapt';
import { Client } from 'bitcore-wallet-client';
import xs, { MemoryStream, Stream } from 'xstream';
import { BlockchainAgentOptionBase } from './common';

export interface BWSClientOption extends BlockchainAgentOptionBase {
  readonly xIdentity?: string;
  readonly xSignature?: string;
  readonly apiBase?: string;
}

export interface BWSRequest {
  readonly method: [keyof Client];
  readonly options?: ReadonlyArray<any>;
}

export interface BWSResponse {
  readonly [key: string]: any;
}

export const makeBWSDriver = ({ url }: BWSClientOption) => {
  const BWSDriver = (
    request$: Stream<BWSRequest>
  ): MemoryStream<BWSResponse> => {
    const cli = new Client({ baseUrl: url + '/bws/api' });
    request$.map(r => xs.fromPromise(cli[r.method](r.options))).flatten();
    return adapt(request$);
  };
  return BWSDriver;
};
