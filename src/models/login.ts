import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { history } from 'umi';

import { fakeAccountLogin } from '@/services/login';
//import { setAuthority } from '@/utils/authority';
//import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { data } = yield call(fakeAccountLogin, payload);
      // Login successfully
      console.log(data)
      if (data) {
        yield put({
          type: 'changeLoginStatus',
          payload: data,
        });
        localStorage.setItem('token',data);
        const urlParams = new URL(window.location.href);
        const params = {}; //getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
      return data
    },

    logout() {
      const { redirect } = {}; //getPageQuery();
      console.log('logout');
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        window.localStorage.setItem('token', '');
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.data);
      return {
        ...state,
        status: 'ok',
        type: 'account' || payload.type,
      };
    },
  },
};

export default Model;
