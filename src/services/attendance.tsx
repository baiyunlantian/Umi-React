import request from '@/utils/request';
import { person, mdata } from './config'

//考勤首页--校区实时考勤信息统计
export async function getCampusAttendanceInfo(data?:object): Promise<any> {
  return request(`${person}/attendance/attendanceCampusCensus`, {
    method:'post',
    data
  });
}

//考勤首页--寝室实时考勤信息统计
export async function getDormitoryAttendanceInfo(data?:object): Promise<any> {
  return request(`${person}/attendance/attendanceDormitoryCensus`,
    {
      method:'post',
      data
    });
}

//考勤首页--上课时间安排表
export async function getAttendDateArrangeList(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/dateArrangeSelectList`,
    {
      method:'post',
      data
    });
}

//考勤首页--更新上课时间安排表
export async function updateAttendDateArrangeList(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/dateArrangeChange`,
    {
      method:'post',
      data
    });
}

//考勤首页--考勤时间安排修改
export async function attendTimeArrangeChange(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/timeArrangeChange`,
    {
      method:'post',
      data
    });
}

//考勤首页--考勤时间安排列表
export async function attendTimeArrangeSelectList(): Promise<any> {
  return request(`${person}/ruleAttendance/timeArrangeSelectList`,
    {
      method:'post',
    });
}

//考勤查询--班级实时考勤信息统计
export async function getAttendanceClassInfo(data:object): Promise<any> {
  return request(`${person}/attendance/classInfo`,
    {
      method:'post',
      data
    });
}

//考勤查询--寝室考勤统计
export async function getAttendanceDormitoryInfo(data:object): Promise<any> {
  return request(`${person}/attendance/singleDormitoryAttendance`,
    {
      method:'post',
      data
    });
}

//个人详情--校园考勤统计
export async function getPersonCampusDetailInfo(data:object): Promise<any> {
  return request(`${person}/attendance/personCampusDetailInfo`,
    {
      method:'post',
      data
    });
}

//个人详情--寝室考勤统计
export async function getPersonDormitoryDetailInfo(data:object): Promise<any> {
  return request(`${person}/attendance/personDormitoryDetailInfo`,
    {
      method:'post',
      data
    });
}

//更新个人考勤
export async function updateAttendance(): Promise<any> {
  return request(`${person}/attendance/updateAttendance`, {method:'post', });
}

//值班安排--新增、更改值班时间 -== 批量操作
export async function dutyDateBatchChange(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/dutyDateChange`,
    {
      method:'post',
      data
    });
}

//值班安排--值班时间安排列表
export async function dutyDateList(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/dutyDateSelectList`,
    {
      method:'post',
      data
    });
}

//值班安排--删除值班信息（单天）
export async function dutyDateDeleteById(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/dutyDateDeleteById`,
    {
      method:'post',
      data
    });
}

//值班安排--更新值班信息（单天）
export async function dutyDateUpdateById(data:object): Promise<any> {
  return request(`${person}/ruleAttendance/dutyDateUpdateById`,
    {
      method:'post',
      data
    });
}

//值班安排--宿舍列表
export async function getDormitoryList(): Promise<any> {
  return request(`${mdata}/dormitory/dormitoryList`,
    {
      method:'post',
    });
}

//值班安排--新增宿舍
export async function addDormitory(data:object): Promise<any> {
  return request(`${mdata}/dormitory/addDormitory`,
    {
      method:'post',
      data
    });
}

//值班安排--更新宿舍
export async function updateDormitory(data:object): Promise<any> {
  return request(`${mdata}/dormitory/updateDormitory`,
    {
      method:'post',
      data
    });
}

//值班安排--删除宿舍
export async function deleteDormitory(data:object): Promise<any> {
  return request(`${mdata}/dormitory/delDormitory`,
    {
      method:'post',
      data
    });
}

// 考勤导出接口--当天考勤规则查询
export async function selectRuleList(data: any): Promise<any> {
  return request(`${person}/attendance/selectRuleList`, {
    method: 'post',
    data,
  });
}

// 考勤导出接口--校园考勤
export async function exportCampusAttendance(data: any): Promise<any> {
  return request(`${person}/excel/exportCampusAttendance`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}

// 考勤导出接口--班级考勤
export async function exportClassAttendance(data: any): Promise<any> {
  return request(`${person}/excel/exportClassAttendance`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}

// 考勤导出接口--寝室考勤
export async function exportDormitoryAttendance(data: any): Promise<any> {
  return request(`${person}/excel/exportDormitoryAttendance`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}

// 考勤导出接口--校园个人考勤
export async function exportPersonalCampusAttendance(data: any): Promise<any> {
  return request(`${person}/excel/exportPersonalCampusAttendance`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}

// 考勤导出接口--寝室个人考勤
export async function exportPersonalDormitoryAttendance(data: any): Promise<any> {
  return request(`${person}/excel/exportPersonalDormitoryAttendance`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}

// 考勤导出接口--楼栋考勤
export async function exportSingleDormitoryAttendance(data: any): Promise<any> {
  return request(`${person}/excel/exportSingleDormitoryAttendance`, {
    method: 'post',
    data: data,
    responseType: 'blob',
  });
}
