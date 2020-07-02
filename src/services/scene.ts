import request from '@/utils/request';
import { mdata, } from './config'

//获取校区列表
export async function getCampusList(data:object): Promise<any> {
  return request(`${mdata}/scene/findCampus`,
    {
      method: 'post',
      data
    },
  );
}

//更新校区信息
export async function updateCampus(data: object): Promise<any> {
  return request(`${mdata}/scene/updateCampus`,
    {
      method: 'post',
      data
    });
}

//新增校区信息
export async function addCampus(data: object): Promise<any> {
  return request(`${mdata}/scene/addCampus`,
    {
      method: 'post',
      data
    });
}

//删除校区信息
export async function delCampus(data: object): Promise<any> {
  return request(`${mdata}/scene/delCampus`,
    {
      method: 'post',
      data
    });
}
