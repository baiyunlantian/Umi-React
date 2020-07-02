import React, { useEffect, useState, useRef } from 'react';
import {getPersonStatistics,deletePerson} from '@/services/person';
import { person } from '@/services/config';
import SearchArea from '@/pages/components/searchArea';
import CustomTable from '@/pages/components/custom-table';
import styles from './index.less';
import { Button, Modal, Upload, message } from 'antd';

import AddOrUpdateModal from './components/addOrUpdateModal';
import SvgIcon from '@/components/svg/icon';
import { useModel } from '@@/plugin-model/useModel';

export default () => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const currentCampus = JSON.parse(window.localStorage.getItem('currentCampus'));
  let schoolId = '';
  let campusId = '';

  if (campus){
    schoolId = campus.schoolId;
  }
  if (currentCampus){
    campusId = currentCampus.campusId;
  }

  const baseForm = useRef();
  const customTable = useRef();
  const [visible, setVisible] = useState(false);
  const [delModalVisible, setDelModalVisible] = useState(false);  //删除信息模态框
  const [delPersonParams, setDelPersonParams] = useState({});  //删除人员参数
  const [statistics, setStatistics] = useState({
    allCount:0,
    campusName:'',
    studentNum:0,
    teacherNum:0,
    workerNum:0,
    boarderStudentNum:0,
    notBoarderStudentNum:0,
    headerMasterTeacherNum:0,
    leaderTeacherNum:0,
    normalTeacherNum:0,
  });
  const [record, setRecord] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [customPageSize, setCustomPageSize] = useState<number>(window.innerWidth <= 1024 ? 5 : 10);
  const { getPerson } = useModel('role');
  const { getDormitory } = useModel('dormitory');
  const [dormitoryList, setDormitoryList] = useState([]);

  useEffect(()=>{
    getPersonStatistics().then(res=>{
      if (res.data){
        setStatistics(res.data);
      }
    });

    getPerson().then(res=>setRoleList(res));

    getDormitory().then(list => {
      setDormitoryList(list);
    });
  },[]);

  useEffect(()=>{
    window.addEventListener('resize', (event)=>{
      const size =  event.target.innerWidth <= 1024 ? 5 : 10;
      setCustomPageSize(size);
    });
  },[]);

  const handleSearch = values => {
    values.roleId ? values.roleId = Number(values.roleId) : '';
    customTable.current.search(values);
  };

  const handleDeletePerson = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    deletePerson({...delPersonParams}).then(res=>{
      if (res.data){
        setDelModalVisible(false);
        message.success('删除成功');
        customTable.current.search({});
      }
    });
  };

  const handleModalVisible = (visible: boolean) => {
    setRecord('');
    setVisible(visible);
  };

  const modalProps = {
    visible,
    roleId:record.roleId || 0,
    record,
    baseForm,
    handleModalVisible,
    customTable,
    roleList,
    dormitoryList
  };

  const searchProps = {
    handleSearch,
    searchForm: [
      { name: 'name', label: '姓名', type: 'input' },
      { name: 'ipNum', label: '身份证号', type: 'input' },
      {
        name:'roleId',
        type: 'select',
        label: '角色',
        options: roleList,
      }
    ],
  };

  //人员列表
  const visitorsTableProps = {
    url: '/api/person/personList',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          width: '10%',
          editable: true,
          key: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: '5%',
          editable: true,
          key: 'sex',
          render : (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '15%',
          editable: true,
          key: 'ipNum',
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          width: '10%',
          editable: true,
          key: 'phone',
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          width: '5%',
          editable: true,
          key: 'roleName',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '15%',
          editable: true,
          key: 'remark',
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              <SvgIcon
                tipTitle='删除'
                name='delete'
                className={styles.default}
                width={25}
                height={25}
                color="rgb(0, 160, 233)"
                onClick={()=>{
                  const {personId,roleId} = record;
                  setDelModalVisible(true);
                  setDelPersonParams({personId,roleId});
                }}
              />
              <div onClick={()=>{formatPersonData(record);setVisible(true);}}
              >···
              </div>
            </div>
          ),
        },
      ],
    },
  };

  //格式化人员数据
  const formatPersonData = (personData:object) => {
    let data = JSON.parse(JSON.stringify(personData));
    Object.keys(data).forEach(key=>{ data[key] == null ? data[key] = '' : ''});
    if (data.parent){
      if (data.parent.indexOf(',') > 0){
        const array = data.parent.split(',');
        const parent1 = array[0].split('|');
        const parent2 = array[1].split('|');

        data.parentId1 = parent1[0];
        data.parentName1 = parent1[1];
        data.relation1 = parent1[2];
        data.parentPhone1 = parent1[3];
        // data.parentWeChat1 = parent1[4];   暂时不用微信号
        data.parentUrl1 = parent1[5];
        data.parentNum1 = parent1[6];

        data.parentId2 = parent2[0];
        data.parentName2 = parent2[1];
        data.relation2 = parent2[2];
        data.parentPhone2 = parent2[3];
        // data.parentWeChat2 = parent2[4];
        data.parentUrl2 = parent2[5];
        data.parentNum2 = parent2[6];
      }else {
        const parent1 = data.parent.split('|');

        data.parentId1 = parent1[0];
        data.parentName1 = parent1[1];
        data.relation1 = parent1[2];
        data.parentPhone1 = parent1[3];
        data.parentUrl1 = parent1[5];
        data.parentNum1 = parent1[6];
      }

      delete data.parent;
    }

    setRecord(data);
  };


  const uploadOption = {
    name: 'file',
    action: `${person}/excel/importPerson`,
    accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    data:{ schoolId, campusId,},
    headers: {
      token: localStorage.getItem('token'),
    },
    onChange:({file})=>{
      console.log(file);
    },
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.peopleManagement}>
      <div className={styles.top}>
        <div className={styles.statistics}>
          <div className={styles.title}>
            <div className={styles.text}>人员统计</div>
          </div>
          <div className={styles.content}>
            <div className={styles.info}>
              <div>{statistics.campusName}总人数：</div>
              <div className={styles.number}>{statistics.allCount}</div>
              <div>人</div>
            </div>
          </div>
        </div>
        <div className={styles.analyze}>
          <div className={styles.title}>
            <div className={styles.text}>人员角色分析</div>
          </div>
          <div className={styles.content}>
            <div className={styles.infoList}>
              <div className={styles.info} style={{paddingLeft: "2%"}}>
                <div className={styles.scala}><span className={styles.roleName}>学生：</span><span className={styles.number} style={{color:'rgb(62, 176, 255)'}}>{statistics.studentNum}</span>人</div>
                <div>
                  <div><span className={styles.roleName}>住校生：</span><span className={styles.number} style={{color:'rgb(62, 176, 255)'}}>{statistics.boarderStudentNum}</span>人</div>
                  <div><span className={styles.roleName}>非住校生：</span><span className={styles.number} style={{color:'rgb(62, 176, 255)'}}>{statistics.notBoarderStudentNum}</span>人</div>
                </div>
              </div>
              <div className={styles.info} style={{padding: "0 2%"}}>
                <div className={styles.scala}><span className={styles.roleName}>教师：</span><span className={styles.number} style={{color:'rgb(73, 241, 172)'}}>{statistics.teacherNum}</span>人</div>
                <div>
                  <div><span className={styles.roleName}>学校领导：</span><span className={styles.number} style={{color:'rgb(73, 241, 172)'}}>{statistics.leaderTeacherNum}</span>人</div>
                  <div><span className={styles.roleName}>班主任：</span><span className={styles.number} style={{color:'rgb(73, 241, 172)'}}>{statistics.headerMasterTeacherNum}</span>人</div>
                  <div><span className={styles.roleName}>普通老师：</span><span className={styles.number} style={{color:'rgb(73, 241, 172)'}}>{statistics.normalTeacherNum}</span>人</div>
                </div>
              </div>
              <div style={{width: "20%",paddingLeft: "2%"}}>
                <div className={styles.scala}>后勤：<span className={styles.number} style={{color:'rgb(149, 136, 208)'}}>{statistics.workerNum}</span>人</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SearchArea {...searchProps} >
        <Button
          type="primary"
          className={styles.addButton}
          onClick={() => {
            handleModalVisible(true);
            baseForm.current && baseForm.current.resetFields();
          }}
        >
          新增人员
        </Button>

      </SearchArea>
      <CustomTable ref={customTable} {...visitorsTableProps} />
        {visible == true ? <AddOrUpdateModal {...modalProps} /> : ''}

      <Modal
        className={styles.infoModal}
        title="人员信息"
        cancelText="关闭"
        okText="确认"
        onCancel={() => setDelModalVisible(false)}
        onOk={handleDeletePerson}
        visible={delModalVisible}
        width={1000}
        closable={false}
      >
        <p style={{fontSize:24,margin:0,color:'rgb(193, 42, 42)'}}>是否删除该条记录?</p>
      </Modal>
    </div>
    </div>
  );
};
