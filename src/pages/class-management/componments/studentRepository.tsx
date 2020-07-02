import React, { useEffect, useState, useRef } from 'react';
import WrappedSearchArea from '@/pages/components/searchArea';
import CustomTable from '@/pages/components/custom-table';
import {batchInsertStudentFormStore} from '@/services/class';
import { Button, message } from 'antd';
import styles from '../detail.less';

export default (
  {
    callback,
    classCode,
    showStudentDetail,
    handleStudentRepositoryModalVisible
  }) => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const [studentIds, setStudentIds] = useState([]);

  const customTable = useRef();

  const handleSearch = values => {
    customTable.current.search(values);
  };

  const selectStudentList = (studentIds:object) => {
    setStudentIds(studentIds);
  };

  //人员库中未绑定班级的学生列表
  const notBindStudentProps = {
    url: '/api/class/studentListFromRepository',
    tableFields: {
      rowKey: 'personId',
      rowSelection:{
        type:'checkbox',
        onChange:selectStudentList
      },
      columns: [
        {
          title: '照片',
          dataIndex: 'personId',
          width: '130px',
          editable: true,
          key: 'personId',
          render:text => (<div onClick={()=>showStudentDetail(text,true)} style={{width:70,cursor:'pointer',textDecoration:'underline'}}>查看>></div>)
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: 50,
          editable: true,
          key: 'name',
          render:text => (<div style={{width:50}}>{text}</div>)
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: 30,
          editable: true,
          key: 'sex',
          render:text => (<div style={{width:30}}>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: 130,
          editable: true,
          key: 'ipNum',
          render:text => (<div style={{width:130}}>{text}</div>)
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          width: 100,
          editable: true,
          key: 'mobile',
          render:text => (<div style={{width:100}}>{text}</div>)
        },
        {
          title: '监护人1',
          dataIndex: 'guardian1Name',
          width: 70,
          editable: true,
          key: 'guardian1Name',
          render:text => (<div style={{width:70}}>{text}</div>)
        },
        {
          title: '手机号(监护人1)',
          dataIndex: 'guardian1Mobile',
          width: 100,
          editable: true,
          key: 'guardian1Mobile',
          render:text => (<div style={{width:100}}>{text}</div>)
        },
        {
          title: '微信号(监护人1)',
          dataIndex: 'guardian1WeChat',
          width: 100,
          editable: true,
          key: 'guardian1WeChat',
          render:text => (<div style={{width:100}}>{text}</div>)
        },
        {
          title: '监护人2',
          dataIndex: 'guardian2Name',
          width: 70,
          editable: true,
          key: 'guardian2Name',
          render:text => (<div style={{width:70}}>{text}</div>)
        },
        {
          title: '手机号(监护人2)',
          dataIndex: 'guardian2Mobile',
          width: 100,
          editable: true,
          key: 'guardian2Mobile',
          render:text => (<div style={{width:100}}>{text}</div>)
        },
        {
          title: '微信号(监护人2)',
          dataIndex: 'guardian2WeChat',
          width: 100,
          editable: true,
          key: 'guardian2WeChat',
          render:text => (<div style={{width:100}}>{text}</div>)
        },
      ],
    },
  };

  const searchProps = {
    searchForm: [
      {
        name: 'name',
        label: '姓名',
        type: 'input',
      },
      {
        name: 'sex',
        label: '性别',
        type: 'input',
      },
      {
        name: 'ipNum',
        label: '身份证号',
        type: 'input',
      },
    ],
    handleSearch,
  };

  const onOk = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const studentList = JSON.parse(JSON.stringify(studentIds));
    batchInsertStudentFormStore({studentList,classCode:Number(classCode)}).then(res=>{
      handleStudentRepositoryModalVisible(false);
      callback();
    });
  };



  return (
    <div className={styles.list}>
      <title>添加学生-人员库添加</title>
      <div className={styles.searchForm}>
        <WrappedSearchArea {...searchProps} />
      </div>

      <CustomTable ref={customTable} {...notBindStudentProps} />
      <div className={styles.boxBtn}>
        <Button onClick={onOk} type="primary">添加</Button>
        <Button
          onClick={() => {
            handleStudentRepositoryModalVisible(false);
          }}
        >取消</Button>
      </div>
    </div>
  )
};
