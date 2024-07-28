import {action, makeObservable, observable} from 'mobx';
import {load, remove} from '../../utils/storage';
import moment from 'moment';

interface IAuth {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message?: string;
  rc?: number;
  expired: number;
}
class AuthenticateStoreImpl {
  authentication: IAuth = {
    token: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    expired: -1,
  };

  constructor() {
    makeObservable(this, {
      authentication: observable,
      createAuth: action,
      removeAuth: action,
    });
  }

  async initializeFromAsyncStorage() {
    const result = await load('token');
    if (result) {
      const isExpired =
        moment(moment().unix()).diff(result.expired, 'days') > 3;
      result.token = isExpired ? null : result.token;
      this.authentication = result;
    }
  }

  createAuth(auth: IAuth) {
    this.authentication = auth;
  }

  removeAuth() {
    remove('token').then(() => {
      this.authentication = {
        token: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        expired: -1,
      };
    });
  }
}

const AuthenticateStore = new AuthenticateStoreImpl();
AuthenticateStore.initializeFromAsyncStorage();
export {AuthenticateStore};
