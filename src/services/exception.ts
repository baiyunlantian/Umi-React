import request from '@/utils/request';
import { person } from './config'

//获取异常信息统计
export async function getExceptionInfo(): Promise<any> {
  return request(`${person}/exceptionQuery/census`, { method: 'post', } );
}

//获取异常角色分析
export async function getExceptionRoleAnalyze(data:object): Promise<any> {
  return request(`${person}/exceptionQuery/roleAnalysis`,
    {
      method: 'post',
      data
    } );
}

//获取异常人员列表
export async function getExceptionPersonList(data:object): Promise<any> {
  return request(`${person}/exceptionQuery/selectList`,
    {
      method: 'post',
      data
    } );
}

//修改人员信息状态
export async function updateExceptionPersonStatus(data:object): Promise<any> {
  return request(`${person}/exceptionQuery/update`,
    {
      method: 'post',
      data
    } );
}

//删除人员信息
export async function delExceptionPerson(data:object): Promise<any> {
  return request(`${person}/exceptionQuery/delete`,
    {
      method: 'post',
      data
    } );
}
