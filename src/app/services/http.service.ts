import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Store } from '@ngxs/store';
import { AccountI } from '../modules/shared/state/account.i';
import { ErrorCodes } from './http-api.code';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _account: AccountI;

  set account(account: AccountI) {
    this._account = account;
  }

  get account() {
    return this._account || {} as any;
  }

  constructor(private http: HTTP, private store: Store) { }

  private url(path: string) {
    if (path.substr(0, 1) === '/') {
      path = path.substr(1);
    }

    const scheme = this.account.secure ? 'https' : 'http';

    return `${scheme}://${this.account.host}/api/v2/${path}`;
  }

  async request(method: string, path: string, data?: any) {
    const token = this.account.token;

    const headers = { 'x-namespace': 'captain' };

    if (token) {
      headers['x-captain-auth'] = token;
    }

    const options = {
      method: method as any,
      headers,
      data,
      serializer: 'json'
    };

    const response = await this.http.sendRequest(this.url(path), options as any);

    try {
      const data = JSON.parse(response.data);

      if (!data.status) {
        throw new ApiError(1000, 'No action status', data);
      }

      if (ErrorCodes.indexOf(data.status) >= 0) {
        throw new ApiError(data.status, data.description, []);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(1000, 'An error has occurred', error);
    }
  }

  get(path: string) {
    return this.request('get', path);
  }

  post(path: string, payload: any) {
    return this.request('post', path, payload);
  }
}


export class ApiError extends Error {
  static readonly UNKNOWN = 1000;

  constructor(public code: number, public message: string, stack?: any) {
    super();

    this.stack = stack;
  }
}