import React, { useEffect, useState, useRef } from 'react';
import BaseForm from '@/pages/components/base-form';
import SvgIcon from '@/components/svg/icon';
import style from '../detail.less';
import {
  insertDepartment,
  insertGrade,
  insertClass,
  updateDepartment,
  updateGrade,
  updateClass
} from '@/services/class';
import {message} from 'antd';
import DeleteModal from '@/pages/class-management/componments/deleteModal';

export default (
  {
    classInfo,
    formList,
    formType,
    isClickAdd,
    gradeId,
    departmentId,
    classId,
    campusId,
    baseForm,
    handleClickAddBtn,
    callback
  }) => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const [isClickEdit, setIsClickEdit] = useState(false);
  const [delModalVisible, setDelModalVisible] = useState(false);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 16 }
    }
  };

  const formProps = {
    initialValues:{gradeId,departmentId,...classInfo},
    hiddenFooter: true,
    formList,
    disabled:!(isClickAdd || isClickEdit)
  };

  //新增或修改 级部、年级、班级信息
  const addOrUpdateInfo = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = baseForm.current.getFormValues();
    const valid = validData(values);
    if (!valid) return;

    Object.keys(values).forEach(key=>{
      if (!values[key]){
        delete values[key]
      }
      if (key == 'code'){
        values[key] = Number(values[key]);
      }
    });

    if (formType == 'class') handleClass(values);
    else if (formType == 'grade') handleGrade(values);
    else if (formType == 'department') handleDepartment(values);
  };

  //新增、修改 级部
  const handleDepartment = (data:object) => {
    if (!isClickAdd){
      updateDepartment({...data,id:departmentId }).then(res=>{
        if (res.data) showTipsMessage('修改级部成功');
      });
    }else {
      insertDepartment({ campusId, ...data }).then(res=>{
        if (res.data) showTipsMessage('新增级部成功');
      });
    }
  };

  //新增、修改 年级
  const handleGrade = (data:object) => {
    if (!isClickAdd){
      updateGrade({...data,id:gradeId }).then(res=>{
        if (res.data) showTipsMessage('修改年级成功');
      });
    }else {
      insertGrade({ departmentId, ...data }).then(res=>{
        if (res.data) showTipsMessage('新增年级成功');
      });
    }
  };

  //新增、修改 班级
  const handleClass = (data:object) => {
    if (!isClickAdd){
      updateClass({ gradeId, ...data,id:classId }).then(res=>{
        if (res.data) showTipsMessage('修改班级成功');
      });
    }else {
      insertClass({ gradeId, ...data }).then(res=>{
        if (res.data) showTipsMessage('新增班级成功');
      });
    }
  };

  const showTipsMessage = (tips:string) => {
    message.success(tips,2);
    handleClickAddBtn(false);
    setIsClickEdit(false);
    setDelModalVisible(false);
    callback(tips);
  };

  //取消 新增或修改信息操作
  const cancelAddOrUpdateClassInfo = () => {
    handleClickAddBtn(false);
    setIsClickEdit(false);
    console.log('取消 新增或修改班级信息操作');
  };

  //校验数据
  const validData = (data:object) => {
    let valid = true;

    Object.keys(data).forEach(key => {
      if (!data[key]){
        if (!valid) return;
        switch (key) {
          case 'name':
            message.error('名称不能为空');
            valid = false;
            break;
          case 'sort' || 'grade' && !Number(data[key]):
            message.error('排序须为数字且不能为空');
            valid = false;
            break;
          case 'gradeId':
            message.error('年级不能为空');
            valid = false;
            break;
          case 'code' && !Number(data[key]):
            message.error('代号须为数字且不能为空');
            valid = false;
            break;
          case 'headTeacherId':
            message.error('负责人/班主任不能为空');
            valid = false;
            break;
          case 'areaName':
            message.error('位置不能为空');
            valid = false;
            break;
          case 'departmentId':
            message.error('级部不能为空');
            valid = false;
            break;
        }
      }
    });

    return valid;
  };

  const handleDelModalVisible = (boolean:boolean) => {
    setDelModalVisible(boolean);
  };

  const deleteModalProps = {
    delModalVisible,
    formType,
    id: classInfo.id,
    handleDelModalVisible,
    onSuccess:showTipsMessage,
  };


  return (
    <div className={style.classInfo}>
      <div className={style.title}>
        <div className={style.text}>{formType == 'department' ? '级部信息' : formType == 'grade' ? '年级信息' : '班级信息'}</div>
      </div>
      <div className={isClickEdit ? `${style.classContent} editing` : style.classContent}>

        { !(isClickAdd || isClickEdit)
          ?
          ''
          : <div className={style.classInfoOperation}>
            <button onClick={addOrUpdateInfo}>{isClickAdd ? '添加' : '保存'}</button>
            <button onClick={cancelAddOrUpdateClassInfo}>取消</button>
          </div>}

         <BaseForm
           ref={baseForm}
           {...formProps}
           formItemLayout={formItemLayout}
         />

        {/* <div className={style.graph}>
          <ECharts option={classOptions} />
        </div> */}

        <div className={style.operationUpdateOrDel}>
          <SvgIcon
            tipTitle='编辑'
            name='update'
            width={22}
            height={22}
            color="rgb(56, 220, 255)"
            onClick={() => {setIsClickEdit(true)}}
          />
          <SvgIcon
            tipTitle='删除'
            name='delete'
            width={22}
            height={22}
            color="rgb(56, 220, 255)"
            onClick={() => {setDelModalVisible(true)}}
          />
        </div>
      </div>

      <DeleteModal {...deleteModalProps}/>
    </div>
  )
};
