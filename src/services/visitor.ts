import request from '@/utils/request';
import { person } from './config'

//实时访客统计
export async function getRealTimeVisitorInfo(data:object): Promise<any> {
  return request(`${person}/visitor/census`,
    {
      method: 'post',
      data
    });
}

//删除预约人员列表记录
export async function deleteAppointmentRecode(data:object): Promise<any> {
  return request(`${person}/visitor/delete`,
    {
      method: 'post',
      data
    });
}

//审核、拒绝待审核访客列表
export async function dealWaitAuditList(data:object): Promise<any> {
  return request(`${person}/visitor/dealNotVerify`,
    {
      method: 'post',
      data
    });
}

//更新预约信息
export async function updateAppointment(data:object): Promise<any> {
  return fetch(`${person}/visitor/update`,
    {
      method: 'post',
      headers:{
        token: localStorage.getItem('token')
      },
      body: data,
    }).then(res => res.json());
}

//更新来访人员异常状态
export async function updateVisitorStatus(data:object): Promise<any> {
  return request(`${person}/visitor/updateArriveGuestState`,
    {
      method: 'post',
      data
    });
}

