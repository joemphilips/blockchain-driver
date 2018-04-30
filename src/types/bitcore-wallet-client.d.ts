import { EventEmitter } from 'events';
import * as SA from 'superagent';

export interface ClientConstructorOption {
  baseUrl?: string;
  request?: SA.Request;
  doNotVerfyPayPro?: boolean;
  timeout?: number;
  logLevel?: string;
  supportStaffWalletId?: string;
}

export declare class Client extends EventEmitter {
  constructor(opts: ClientConstructorOption);

  initialize(opts, cb): void;
}
