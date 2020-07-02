import request from '@/utils/request';
import { mdata, person } from './config';

//获取宿舍字典
export async function dormitoryDownList(): Promise<any> {
  return request(`${mdata}/dormitory/dormitoryDownList`, { method: 'post', } );
}

//模糊查询班级
export async function selectClassFuzzyDownList(data:object): Promise<any> {
  return request(`${mdata}/class/classFuzzyDownList`,
    {
      method: 'post',
      data
    } );
}


//获取校区下的级部信息
export async function getDepartment(data:object): Promise<any> {
  return request(`${mdata}/class/findDepartment`,
    {
      method:'post',
      data
    });
}

//获取初(高)中部的年级信息
export async function getGradeList(data:object): Promise<any> {
  return request(`${mdata}/class/gradeList`,
    {
      method:'post',
      data
    });
}

//获取年级下的班级信息列表
export async function getClassList(data:object): Promise<any> {
  return request(`${mdata}/class/classList`,
    {
      method:'post',
      data
    });
}

//班级统计信息
export async function getClassStatisticsInfo(data:object): Promise<any> {
  return request(`${mdata}/class/classStatistics`,
    {
      method:'post',
      data
    });
}

//班级详情信息
export async function getClassDetail(data:object): Promise<any> {
  return request(`${mdata}/class/classInfoDetail`,
    {
      method:'post',
      data
    });
}

//年级详情信息
export async function getGradeDetailInfo(data:object): Promise<any> {
  return request(`${mdata}/class/gradeInfoDetail`,
    {
      method:'post',
      data
    });
}


//班级详情--查看学生个人详情
export async function getStudentDetailInfo(data:any): Promise<any> {
  return request(`${person}/getStudentDetailInfo`,
    {
      method:'post',
      data
    }
  );
}


//新增-级部
export async function insertDepartment(data:object): Promise<any> {
  return request(`${mdata}/class/insertDepartment`,
    {
      method:'post',
      data
    }
  );
}

//更新-级部
export async function updateDepartment(data:object): Promise<any> {
  return request(`${mdata}/class/updateDepartment`,
    {
      method:'post',
      data
    }
  );
}

//删除-年级
export async function delDepartment(data:object): Promise<any> {
  return request(`${mdata}/class/delDepartment`,
    {
      method:'post',
      data
    }
  );
}

//新增-年级
export async function insertGrade(data:object): Promise<any> {
  return request(`${mdata}/class/insertGrade`,
    {
      method:'post',
      data
    }
  );
}

//删除-年级
export async function delGrade(data:object): Promise<any> {
  return request(`${mdata}/class/delGrade`,
    {
      method:'post',
      data
    }
  );
}

//更新年级
export async function updateGrade(data:object): Promise<any> {
  return request(`${mdata}/class/updateGrade`,
    {
      method:'post',
      data
    }
  );
}

//年级升级
export async function upgrade(): Promise<any> {
  return request(`${mdata}/class/upgradeClass`, { method:'post', });
}

//新增-班级
export async function insertClass(data:object): Promise<any> {
  return request(`${mdata}/class/addClass`,
    {
      method:'post',
      data
    }
  );
}

//更新-班级
export async function updateClass(data:object): Promise<any> {
  return request(`${mdata}/class/updateClass`,
    {
      method:'post',
      data
    }
  );
}

//删除-班级
export async function delClass(data:object): Promise<any> {
  return request(`${mdata}/class/delClass`,
    {
      method:'post',
      data
    }
  );
}


//批量删除学生
export async function batchDeleteStudent(data:object): Promise<any> {
  return request(`${person}/class/deleteListStudentWithState`,
    {
      method:'post',
      data
    }
  );
}

//学生批量导入班级,来自人员库
export async function batchInsertStudentFormStore(data:object): Promise<any> {
  return request(`${person}/class/insertListStudentFromWhite`,
    {
      method:'post',
      data
    }
  );
}
