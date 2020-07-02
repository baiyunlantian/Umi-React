import request from '@/utils/request';
import { person } from './config'


//人员统计
export async function getPersonStatistics(): Promise<any> {
  return request(`${person}/person/personStatistics`, { method: 'post', });
}

//删除人员
export async function deletePerson(data:object): Promise<any> {
  return request(`${person}/person/delete`,
    {
      method: 'post',
      data
    });
}

//更新人员
export async function updatePerson(data:object): Promise<any> {
  return fetch(`${person}/person/update`,
    {
      method: 'post',
      headers:{
        token: localStorage.getItem('token')
      },
      body: data,
    }).then(res => res.json());
}

//新增人员
export async function insertPerson(data:object): Promise<any> {
  return fetch(`${person}/person/insert`,
    {
      method: 'post',
      headers:{
        token: localStorage.getItem('token')
      },
      body: data,
    }).then(res => res.json());
}


//查看学生详情
export async function getStudentDetailInfo(data:object): Promise<any> {
  return request(`${person}/person/studentInfo`,
    {
      method:'post',
      data
    }
  );
}

//查询宿管员、教师人员列表
export async function selectPersonFuzzyDownList(data:object): Promise<any> {
  return request(`${person}/person/personFuzzyDownList`,
    {
      method:'post',
      data
    }
  );
}

// 考勤导入接口--批量导入人员
export async function importPerson(data: any): Promise<any> {
  return request(`${person}/excel/importPerson`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}

// 字典--学生，教师，后勤，访客
export async function commonRole(): Promise<any> {
  return request(`${person}/role/commonRole`, {
    method:'post',
  });
}

// 字典--监护人
export async function parentRole(): Promise<any> {
  return request(`${person}/role/parentRole`, {
    method:'post',
  });
}

// 字典--学生，教师，后勤
export async function personRole(): Promise<any> {
  return request(`${person}/role/personRole`, {
    method:'post',
  });
}

// 字典--班主任，领导
export async function teacherRole(): Promise<any> {
  return request(`${person}/role/teacherRole`, {
    method:'post',
  });
}
