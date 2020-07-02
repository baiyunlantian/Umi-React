import { history } from 'umi';
import request from '@/utils/request';
import { appRunStatus } from './debugindex';

// appRunStatus();

export async function getInitialState() {
  const token = window.localStorage.getItem('token' || '{}');
  const campusList = JSON.parse(window.localStorage.getItem('campus') || "{}").campusList;
  return {
    token,
    campusList
  };
}

export function render(oldRender: Function) {
  const token = window.localStorage.getItem('token' || '{}');
  const campusList = window.localStorage.getItem('campus' || '{}');
  if (!token || !campusList || token === 'undefined') {
    history.push('/user/login');
    oldRender();
  } else {
    oldRender();
  }
}

