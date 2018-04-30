import { setup } from '@cycle/run';
import test from 'ava';
import xs from 'xstream';
import { makeBWSDriver } from '.';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

test('bws driver', async t => {
  const main = _ => {
    return {
      Blockchain: xs.of({ method: 'getVersion' })
    };
  };

  const driver = makeBWSDriver({
    url: 'http://localhost:3232'
  });

  const { run, sources } = setup(main, { Blockchain: driver });
  sources.Blockchain.addListener({
    next: v =>
      t.is(v, 'bws-2.4.0', 'can query the service version to bws server')
  });

  run();
  await sleep(200);
});
