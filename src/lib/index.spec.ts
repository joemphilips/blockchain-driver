import * as Cycle from '@cycle/run';
import test from 'ava';
import xs from 'xstream';
import { BitcoindRPCRequest, makeTrustedBitcoindDriver } from './';

test('driver for bitcoind', t => {
  t.plan(1);
  const main = (_: { readonly Blockchain: BitcoindRPCRequest }) => {
    return {
      Blockchain: xs.of({ method: 'ping' })
    };
  };
  /* tslint:disable-next-line:no-expression-statement */
  const driver = makeTrustedBitcoindDriver({
    username: 'foo',
    password: 'bar',
    port: 18332
  });
  const { run } = Cycle.setup(main, { Blockchain: driver });
  run();

  const response$ = xs.of();
  response$.addListener({
    next: _ => t.pass()
  });
});
