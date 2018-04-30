import { adapt } from '@cycle/run/lib/adapt';
import { default as OriginalClient } from 'bitcore-wallet-client';
import { promisifyAll } from 'bluebird';
import xs, { MemoryStream, Stream } from 'xstream';
import { BlockchainAgentOptionBase } from './common';

export interface BWSClientOption extends BlockchainAgentOptionBase {
  readonly xIdentity?: string;
  readonly xSignature?: string;
  readonly apiBase?: string;
}

export interface BWSRequest {
  readonly method: keyof OriginalClient;
  readonly options?: ReadonlyArray<any>;
}

export interface BWSResponse {
  readonly [key: string]: any;
}

export const makeBWSDriver = ({ url }: BWSClientOption) => {
  /* tslint:disable-next-line */
  console.log(`going to promisify ${OriginalClient}`);
  const Client = promisifyAll(OriginalClient);
  const BWSDriver = (
    request$: Stream<BWSRequest>
  ): MemoryStream<BWSResponse> => {
    const cli = new Client({ baseUrl: url + '/bws/api', timeout: 3000 });
    const response$ = request$
      .map(r => xs.fromPromise(cli[r.method](r.options)))
      .flatten();
    return adapt(response$);
  };
  return BWSDriver;
};
