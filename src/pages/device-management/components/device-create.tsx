import React, { useRef,useState,useEffect } from 'react';
import { Modal } from 'antd';
import BaseForm from '@/pages/components/base-form/index';
import style from '../index.less';
import { useModel } from 'umi';

export default ({ visible, handleVisible, initialValues, onSubmit,}) => {
  const [dormitoryList, setDormitoryList] = useState([]);
  const [formType, setFormType] = useState();
  const baseForm = useRef();

  const dormitoryFormList = [
    { name: 'locationType', label: '位置', type: 'select',
      options:[
        { key:0,label:'校园' },
        { key:1,label:'寝室' },
        { key:2,label:'其它' }
      ],
      onChange:(value:string)=>{setFormType(value)}
    },
    { name: 'access', label: '出入口状态', type: 'select', options: [
        { key:0,label:'入口'},
        { key:1,label:'出口'}
      ] },
    {
      name:'dormitoryId',
      label:'寝室',
      type:'select',
      options:dormitoryList,
    },
    { name: 'areaName', label: '详细位置', type: 'input', },
    { name: 'ip', label: 'IP', type: 'input', },
    { name: 'port', label: '端口', type: 'input', },
    { name: 'status', label: '设备状态', type: 'select',options: [
        { key: 0, label: '运行中'},
        { key: 1, label: '未开启'},
        { key: 2, label: '故障'},
        { key: 3, label: '维护中'}
      ] },
  ];
  const otherFormList = [
    { name: 'locationType', label: '位置', type: 'select',
      options:[
        { key:0,label:'校园' },
        { key:1,label:'寝室' },
        { key:2,label:'其它' }
      ],
      onChange:(value:string)=>{setFormType(value)}
    },
    { name: 'access', label: '出入口状态', type: 'select', options: [
        { key:0,label:'入口'},
        { key:1,label:'出口'}
      ] },
    { name: 'areaName', label: '详细位置', type: 'input', },
    { name: 'ip', label: 'IP', type: 'input', },
    { name: 'port', label: '端口', type: 'input', },
    { name: 'status', label: '设备状态', type: 'select',options: [
        { key: 0, label: '运行中'},
        { key: 1, label: '未开启'},
        { key: 2, label: '故障'},
        { key: 3, label: '维护中'}
      ] },
  ];

  const { getDormitory } = useModel('dormitory');
  useEffect(() => {
    getDormitory().then(list => {
      dormitoryFormList.forEach(item=>{
        if (item.name === 'dormitoryId'){
          item.options = list;
          setDormitoryList(list);
          return;
        }
      })
    });
  }, []);



  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  const formProps = {
    hiddenFooter: true,
    formList: formType == undefined ?
              initialValues.locationType == 1 ? dormitoryFormList : otherFormList
              : formType == 1 ? dormitoryFormList : otherFormList,
    initialValues
  };

  return (
    <Modal
      className={style.deviceCreate}
      title={Object.keys(initialValues).length ? '修改设备信息': '添加设备'}
      cancelText="取消"
      okText='确定'
      onCancel={() => {
        baseForm.current.resetFields();
        handleVisible();
        setFormType(undefined);
      }}
      onOk={() => {
        const values = baseForm.current.getFormValues();
        if (values.status === '0'){
          values.running = 0;
          values.status = 0;
        }else if(values.status === '1'){
          values.running = 1;
          values.status = 0;
        }else if(values.status === '2'){
          values.status = 1;
        }else if(values.status === '3'){
          values.status = 2;
        }
        onSubmit({id:initialValues.id || '', ...values});
        baseForm.current.resetFields();
        handleVisible();
        setFormType(undefined);
      }}
      visible={visible}
    >
      <BaseForm ref={baseForm} formItemLayout={formItemLayout} {...formProps} />
    </Modal>
  );
};
