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

/**
 * NOTE: You must first call following method to get authenticated to the service
 * - seedFromRandomWithMnemonic
 * - seedFromExtendedPrivateKey
 * - seedFromMnemonic
 * - seedFromExtendedPublicKey
 * - seedFromRandom
 * - import
 * - importFromExtendedPublicKey
 * - importFromExtendedPrivateKey
 *
 * @param url ... the url to which you want to query
 */
export const makeBWSDriver = ({ url }: BWSClientOption) => {
  const BWSDriver = (
    request$: Stream<BWSRequest>
  ): MemoryStream<BWSResponse> => {
    const cli = new Client({ baseUrl: url + '/bws/api', timeout: 3000 });
    const response$ = request$
      /* tslint:disable-next-line */
      .debug(r => console.log(`going to call ${r.method} with ${r.options}`))
      .map(r =>
        xs.fromPromise(
          r.options
            ? util.promisify(cli[r.method]).bind(cli)(...r.options)
            : util.promisify(cli[r.method]).bind(cli)()
        )
      )
      .flatten();
    return adapt(response$);
  };
  return BWSDriver;
};
