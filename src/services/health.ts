import request from '@/utils/request';
import { person } from './config'


//今日体温统计
export async function getHealthLeft(data:object): Promise<any> {
  return request(`${person}/health/animalHeatInfo/left`,
    {
      method: 'post',
      data
    } );
}

//今日体温角色分析
export async function getHealthRight(data:object): Promise<any> {
  return request(`${person}/health/animalHeatInfo/right`,
    {
      method: 'post',
      data
    } );
}

//个人信息和健康指数
export async function getHealthPersonDetail(data:object): Promise<any> {
  return request(`${person}/health/personDetail`,
    {
      method: 'post',
      data
    } );
}


//更新人员体温状态
export async function updateHealthState(data:object): Promise<any> {
  return request(`${person}/health/update`,
    {
      method: 'post',
      data
    } );
}

//人员体温趋势图
export async function getPersonAnimalHeatList(data:object): Promise<any> {
  return request(`${person}/health/personAnimalHeatDetail`,
    {
      method: 'post',
      data
    } );
}

