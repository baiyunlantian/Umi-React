import request from '@/utils/request';
import { mdata } from './config'

//设备管理-设备统计信息
export async function getDeviceStatisticsInfo(data:object): Promise<any> {
  return request(`${mdata}/terminal/terminalStatisticsInfo`, {
    method: 'post',
    data
  });
}

//设备管理-设备解绑
export async function unbindTerminal(data:object): Promise<any> {
  return request(`${mdata}/terminal/unbindTerminal`, {
    method: 'post',
    data
  });
}

//设备管理-设备解绑
export async function updateTerminal(data:object): Promise<any> {
  return request(`${mdata}/terminal/updateTerminal`, {
    method: 'post',
    data
  });
}

//设备管理- 操作设备
export async function terminalOperate(data:object): Promise<any> {
  return request(`${mdata}/terminal/terminalOperate`, {
    method: 'post',
    data
  });
}

//设备管理-设备轮播图list
export async function getDeviceSlideList(data:object): Promise<any> {
  return request(`${mdata}/terminal/slideshowList`, {
    method: 'post',
    data
  });
}

//设备管理-设置轮播图是否轮播
export async function setSlideItemShow(data:object): Promise<any> {
  return request(`${mdata}/terminal/slideshowSetShow`, {
    method: 'post',
    data
  });
}

//设备管理-查看声音信息
export async function getVoiceInfo(data:object): Promise<any> {
  return request(`${mdata}/terminal/voiceInfo`, {
    method: 'post',
    data
  });
}

//设备管理-修改声音信息
export async function updateVoiceInfo(data:object): Promise<any> {
  return request(`${mdata}/terminal/updateVoice`, {
    method: 'post',
    data
  });
}
