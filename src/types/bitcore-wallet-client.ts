import { EventEmitter } from 'events';
import * as SA from 'superagent';
/* tslint:disable */

export interface ClientConstructorOption {
  baseUrl?: string;
  request?: SA.Request;
  doNotVerfyPayPro?: boolean;
  timeout?: number;
  logLevel?: string;
  supportStaffWalletId?: string;
}

export type WalletID = string;
export type UUID = string;

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

declare class Client extends EventEmitter {
  constructor(opts: ClientConstructorOption);

  initialize(opts, cb): void;

  createWallet(opts: CreateWalletOpts): WalletID;

  getStatus(): getStatusResult;
}

export default Client;
