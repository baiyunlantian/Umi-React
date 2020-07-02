import request from '@/utils/request';
import { mdata, user } from './config'

export async function query(): Promise<any> {
  return request(`${mdata}/users`);
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function fetchWeather(): Promise<any> {
  return fetch(
    'https://tianqiapi.com/api?version=v6&appid=21482146&appsecret=Sky8XG7D',
  ).then(res => res.json());
}

export async function newAccount(data: any): Promise<any> {
  return request(`${user}/user/insert`,
    {
      method: 'post',
      data
    });
}
