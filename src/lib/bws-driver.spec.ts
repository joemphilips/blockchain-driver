import { setup } from '@cycle/run';
import test from 'ava';
import xs, { Stream } from 'xstream';
import { BWSRequest, BWSResponse, makeBWSDriver } from '.';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

interface BWSTestSink {
  readonly Blockchain: Stream<BWSRequest>;
}
interface BWSTestSource {
  readonly Blockchain: Stream<BWSResponse>;
}

test('bws driver can getVersion', async t => {
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
      t.is(
        v.serviceVersion,
        'bws-2.4.0',
        'can query the service version to bws server'
      ),
    error: e => t.fail(e),
    complete: () => t.fail('complete shuold not be called')
  });

  run();
  await sleep(2000);
});

test('bws driver can createWallet', async t => {
  t.plan(1);
  const main = (_: BWSTestSource): BWSTestSink => {
    const createWalletOpts: ReadonlyArray<any> = [
      'Test Wallet', // wallet name
      'Irene', // copayer name
      2, // m
      2, // n
      { network: 'testnet' }
    ];
    return {
      Blockchain: xs.of({ method: 'createWallet', options: createWalletOpts })
    };
  };

  const driver = makeBWSDriver({
    url: 'http://localhost:3232'
  });

  const { run, sources } = setup(main, { Blockchain: driver });
  sources.Blockchain.addListener({
    next: v =>
      t.is(
        v.substring(v.length - 3, v.length),
        'btc',
        `result for createWallet must be wallet id, ending with btc`
      ),
    error: e => t.fail(e),
    complete: () => t.fail('complete shuold not be called')
  });

  run();
  await sleep(10000);
});

test('bws driver can getNotification with auth', async t => {
  t.plan(1);
  const main = (_): BWSTestSink => {
    const createWalletOpts: ReadonlyArray<any> = [
      'Test Wallet', // wallet name
      'Irene', // copayer name
      2, // m
      2, // n
      { network: 'testnet' }
    ];
    return {
      Blockchain: xs.create({
        start: async l => {
          l.next({ method: 'createWallet', options: createWalletOpts });
          await sleep(3000);
          l.next({ method: 'openWallet' });
        },
        /* tslint:disable-next-line:no-empty */
        stop: () => {}
      })
    };
  };

  const driver = makeBWSDriver({
    url: 'http://localhost:3232'
  });

  const { run, sources } = setup(main, { Blockchain: driver });
  sources.Blockchain.addListener({
    next: v => t.fail(`result from getNotifications was ${v}`),
    error: e => t.fail(e),
    complete: () => t.fail('complete shuold not be called')
  });

  run();
  await sleep(4000);
});
