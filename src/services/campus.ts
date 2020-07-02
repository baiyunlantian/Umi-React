import request from '@/utils/request';
import { person } from './config'


//获取总校区--人数
export async function getCampusTotalPerson(data:object): Promise<any> {
  return request(`${person}/campus/totalPerson`,
    {
      method: 'post',
      data
    });
}

//获取总校区--考勤人数
export async function getCampusTotalAttendance(data:object): Promise<any> {
  return request(`${person}/campus/totalAttendance`,
    {
      method: 'post',
      data
    } );
}



//获取总校区--体温统计
export async function getCampusTotalAnimalHeat(data:object): Promise<any> {
  return request(`${person}/campus/totalAnimalHeat`,
    {
      method: 'post',
      data
    } );
}

//获取总校区--访客统计
export async function getCampusTotalVisitor(data:object): Promise<any> {
  return request(`${person}/campus/totalVisitor`,
    {
      method: 'post',
      data
    } );
}


//获取某校区--实时在校人数
export async function getCampusPerson(): Promise<any> {
  return request(`${person}/campus/detail/person`, { method: 'post', } );
}

//获取某校区--实时访客统计
export async function getCampusVisitor(data:object): Promise<any> {
  return request(`${person}/campus/detail/visitor`,
    {
      method: 'post',
      data:{
        ...data,
      }
    } );
}

//获取某校区--实时考勤人数
export async function getCampusAttendance(): Promise<any> {
  return request(`${person}/campus/detail/attendance`, { method: 'post', } );
}

//获取某校区--实时体温统计
export async function getCampusAnimalHeat(data:object): Promise<any> {
  return request(`${person}/campus/detail/animalHeat`,
    {
      method: 'post',
      data:{
        ...data,
      }
    } );
}

//获取某校区--实时异常体温统计
export async function getCampusExceptionAnimalHeat(): Promise<any> {
  return request(`${person}/campus/detail/exceptionAnimalHeat`, { method: 'post', } );
}
