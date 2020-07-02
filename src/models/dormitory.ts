import { useImmer } from 'use-immer';
import { dormitoryDownList } from '@/services/class';

export default () => {
  let [dormitory, setDormitory] = useImmer<any>([]);

  const getDormitory = async () => {
    if (dormitory.length) {
      return dormitory;
    }
    const {data} = await dormitoryDownList();
    const list = (data || []).map(item => {
      return  { key: item.code, label: item.name }
    })
    setDormitory(value => list);
    return list;
  }



  return {getDormitory};
};
