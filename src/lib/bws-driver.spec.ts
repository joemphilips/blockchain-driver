import { setup } from '@cycle/run';
import test from 'ava';
import xs from 'xstream';
import { makeBWSDriver } from '.';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

test('bws driver', async t => {
  t.plan(1);
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
      t.is(v, 'bws-2.4.0', 'can query the service version to bws server'),
    error: e => t.fail(e),
    complete: () => t.fail('complete shuold not be called')
  });

  run();
  await sleep(20000);
});
