import React, { useEffect, useState, useRef } from 'react';
import {Modal, message } from 'antd';
import {delClass,delGrade,delDepartment} from '@/services/class';

export default ({delModalVisible, formType, onSuccess, handleDelModalVisible, id}) => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const text = formType == 'department' ? '级部' : formType == 'grade' ? '年级' : '班级';

  const onOk = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    if (formType == 'department'){
      delDepartment({id}).then(res=>{
        res.data ? onSuccess('删除级部成功') : message.error('删除失败');
      });
    }else if (formType == 'grade'){
      delGrade({id}).then(res=>{
        res.data ? onSuccess('删除年级成功') : message.error('删除失败');
      });
    }else if (formType == 'class'){
      delClass({classIds:[id]}).then(res=>{
        res.data ? onSuccess('删除班级成功') : message.error('删除失败');
      });
    }
  };

  return(
    <Modal
      className='customModal'
      visible={delModalVisible}
      onOk={onOk}
      onCancel={()=>handleDelModalVisible(false)}
      okText='删除'
      cancelText='取消'
      closable={false}
      width={600}
    >
      <p style={{fontSize:24,margin:0,color:'#fff'}}>确认删除选中的{text}信息吗?</p>
      <p style={{fontSize:16,margin:0,color:'#c10000'}}>删除后{text}内的学生信息需要重新绑定，请谨慎操作!</p>
    </Modal>
  )
};
