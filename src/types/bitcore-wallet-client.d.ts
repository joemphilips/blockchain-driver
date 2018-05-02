declare module 'bitcore-wallet-client' {
  import { EventEmitter } from 'events';

  export interface ClientConstructorOption {
    baseUrl: string;
    request: any; // TODO: this should be `Request` in superagent
    doNotVerfyPayPro: boolean;
    timeout: number;
    logLevel: string;
    supportStaffWalletId: string;
  }

  export type WalletID = string;
  export type UUID = string;

  export type Callback = (...args: any[]) => void;

  export type SupportedLanguage = 'en' | string;

  export type CreateWalletOpts = [
    string,
    string,
    number,
    number,
    { network: string }
  ];

  export type Coin = 'bch' | 'btc';

  export type hexString = string;

  export type Network = 'testnet' | 'livenet';

  export interface WalletInfo {
    version: string;
    createdOn: number;
    id: UUID;
    name: string;
    m: number;
    n: number;
    singleAddress: boolean;
    status: string;
    copayers: Array<CopayerInfo>;
    coin: Coin;
    network: Network;
    derivationStrategy: string;
    addressType: string;
    scanStatus: string | null;
    secret: WalletID;
    encryptedName: string;
  }

  export interface CopayerInfo {
    version: number;
    createdOn: number;
    coin: Coin;
    id: hexString;
    name: string;
    requestPubKeys: Array<{ key: string; signature: string }>;
    encryptedName: string;
  }
  export interface BalanceInfo {
    totalAmount: number;
    lockedAmount: number;
    totalConfirmedAmount: number;
    lockedConfirmedAmount: number;
    availableAmount: number;
    availableConfirmedAmount: number;
    byAddress: any[];
  }

  export interface getStatusResult {
    wallet: WalletInfo;
    preferences: any;
    pendingTxps: any[];
    balance: BalanceInfo;
  }

  export interface initNotificationOpts {
    notificationIntervalSeconds: number;
  }

  export type SupportedCoinType = 'btc' | 'bch';
  export type NetworkType = 'livenet' | 'testnet';

  export interface NetworkOpts {
    coin: SupportedCoinType;
    network: NetworkType;
  }

  export interface seedFromRandomOpts extends NetworkOpts {
    passphrase: string;
    language: SupportedLanguage;
    account: number;
  }

  class Client extends EventEmitter {
    constructor(opts: Partial<ClientConstructorOption> | null);

    initialize(opts: initNotificationOpts | null, cb: Callback): void;

    dispose(cb: Callback): void;

    seedFromRandom(opts: NetworkOpts | null): void;

    seedFromRandomWithMnemonic(opts: seedFromRandomOpts | null): void;

    seedFromExtendedPrivateKey(
      xPrivKey: string,
      opts: {
        coin?: SupportedCoinType;
        account?: number;
        derivationStrategy?;
      } | null
    ): void;

    validateKeyDerivation(opts: {
      passphrase: string;
      skipDeviceValidation: boolean;
    }): void;

    createWallet(opts: CreateWalletOpts): void;

    getStatus(): void | Promise<getStatusResult>;
  }

  export default Client;
}
