import request from '@/utils/request';
import { account } from './config'


export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(data: LoginParamsType) {
  return request(`${account}/doLogin`, {
    method: 'POST',
    data
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
