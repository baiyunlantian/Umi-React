import { useImmer } from 'use-immer';
import { commonRole,personRole,parentRole,teacherRole } from '@/services/person';

export default () => {
  let [common, setCommon] = useImmer<any>([]);
  let [person, setPerson] = useImmer<any>([]);
  let [teacher, setTeacher] = useImmer<any>([]);
  let [parent, setParent] = useImmer<any>([]);

  // 字典--学生，教师，后勤，访客
  const getCommon = async () => {
    if (common.length) {
      return common;
    }
    const {roleList} = await commonRole();
    const list = (roleList || []).map(item => {
      return  { key: item.roleId, label: item.roleName }
    });
    setCommon(value => list);
    return list;
  };

  // 字典--班主任，领导
  const getTeacher = async () => {
    if (teacher.length) {
      return teacher;
    }
    const {roleList} = await teacherRole();
    const list = (roleList || []).map(item => {
      return  { key: item.roleId, label: item.roleName }
    });
    setTeacher(value => list);
    return list;
  };

  // 字典--学生，教师，后勤
  const getPerson = async () => {
    if (person.length) {
      return person;
    }
    const {roleList} = await personRole();
    const list = (roleList || []).map(item => {
      return  { key: item.roleId, label: item.roleName }
    });
    setPerson(value => list);
    return list;
  };

  // 字典--监护人
  const getParent = async () => {
    if (parent.length) {
      return parent;
    }
    const {roleList} = await parentRole();
    const list = (roleList || []).map(item => {
      return  { key: item.roleId, label: item.roleName }
    });
    setParent(value => list);
    return list;
  };


  return {getCommon,getPerson,getTeacher,getParent};
};
