//健康管理页面
import React, { useState, useEffect,useRef } from 'react';
import styles from './index.less';
import { Link } from 'umi';
import CustomTable from '@/pages/components/custom-table';
import WrappedSearchArea from '@/pages/components/searchArea';
import TodayAnimalHeat from './components/todayAnimalHeat';
import RoleAnalyze from './components/roleAnalyze';
import {updateHealthState} from '@/services/health';
import SvgIcon from '@/components/svg/icon';
import { message, Modal } from 'antd';
import { getExceptionInfo } from '@/services/exception';
import { useModel } from '@@/plugin-model/useModel';
import { selectClassFuzzyDownList } from '@/services/class';


export default () => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const [visible, setVisible] = useState(false);
  const [personId, setPersonId] = useState();
  const [roleList, setRoleList] = useState([]);
  const [filterClassList, setFilterClassList] = useState([]);
  const [customPageSize, setCustomPageSize] = useState<number>(window.innerWidth <= 1024 ? 6 : 8);
  const { getCommon } = useModel('role');

  useEffect(()=>{
    getCommon().then(res=>setRoleList(res));
  },[]);

  useEffect(()=>{
    window.addEventListener('resize', (event)=>{
      const {innerWidth} = event.target;
      const size = innerWidth <= 1024 ? 6 : 8;
      setCustomPageSize(size);
    });
  },[]);

  const customTable = useRef();
  const handleSearch = values => {

    if (values) {
      if (values.createTime && values.createTime.length > 0) {
        values.startTime = values.createTime[0].format('YYYY-MM-DD')+' 00:00:00';
        values.endTime = values.createTime[1].format('YYYY-MM-DD')+' 00:00:00';
        delete values.createTime;
      }
      if(values.bodyState && values.bodyState == 2){
        delete values.bodyState;
      }
    }
    Object.keys(values).forEach(key=>{
      if (values[key] == null || values[key] == undefined || values[key] === ''){
        delete values[key];
      }
    });
    customTable.current.search(values);
  };

  const handleHealthState = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    updateHealthState({personId}).then(res=>{
      if (res.data){
        customTable.current.search({});
      }
    });
  };

  const filterClass = (value:string) => {
    if (value.length >= 2){
      selectClassFuzzyDownList({className:value}).then(res=>{
        if (res.data){
          const list = res.data.map(item=>{
            const {classCode:key, className, gradeName, departmentName} = item;
            return {key, label:departmentName+gradeName+className};
          });
          setFilterClassList(list);
        }
      });
    }
  };

  const searchProps = {
    searchForm: [
      {
        name: 'classCode',
        label: '班级',
        type: 'select',
        options:filterClassList,
        filterOption:true,
        onSearch:filterClass,
        showSearch:true
      },
      {
        name: 'name',
        label: '姓名',
        type: 'input',
      },
      {
        name: 'roleId',
        label: '角色',
        type: 'select',
        options: roleList,
      },
      {
        name: 'createTime',
        label: '日期',
        type: 'range-picker',
      },
      {
        name:'bodyState',
        type: 'radio',
        label: '状态',
        options: [
          { key: 0, label: '正常' },
          { key: 1, label: '异常' },
          { key: '', label: '全部' },
        ],
      }
    ],
    handleSearch,
  };

  const tableProps = {
    url: '/api/health/animalHeatPersonList',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      className: styles.person_table,
      columns: [
        {
          title: '班级',
          dataIndex: 'className',
          width: '12%',
          editable: true,
          key: 'className',
        },
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
          width: '8%',
          editable: true,
          key: 'sex',
          render:sex => (<div>{sex === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证',
          dataIndex: 'ipNum',
          width: '12%',
          editable: true,
          key: 'ipNum',
        },
        {
          title: '体温',
          dataIndex: 'temp',
          width: '10%',
          editable: true,
          key: 'temp',
        },
        {
          title: '体温测量日期',
          dataIndex: 'checkTime',
          width: '20%',
          editable: true,
          key: 'checkTime',
        },
        {
          title: '状态',
          dataIndex: 'bodyState',
          width: '8%',
          editable: true,
          key: 'bodyState',
          render:text => (<div style={text === 0 ? {} : {color:'red'}}>{text === 0 ? '正常' : '异常'}</div>)
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          width: '8%',
          editable: true,
          key: 'roleName',
        },
        {
          title: '操作',
          key: 'action',
          width: '15%',
          render: (text, record) => (
              <div className={styles.operation}>
                {
                  record.status == 0
                    ?
                    <SvgIcon
                      tipTitle='编辑'
                      name='update'
                      width={25}
                      height={25}
                      color="rgb(56, 220, 255)"
                      onClick={() => {
                        setVisible(true);
                        setPersonId(record.personId)
                      }}
                    />
                    : ''
                }

                {
                  record.roleId != 4
                    ?
                    <Link to={'/health-management/detail?personId='+record.personId+'&roleId='+record.roleId} key="logo">
                      ···
                    </Link>
                    :''
                }

              </div>
          )
        },
      ],
    },
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.healthManagement}>

      <div className={styles.top}>

        <TodayAnimalHeat />
        <RoleAnalyze />

      </div>

      <div className={styles.searchForm}>
        <WrappedSearchArea {...searchProps} />
      </div>

      <CustomTable ref={customTable} {...tableProps}  />

      <Modal
        className={styles.infoModal}
        title="健康状态"
        cancelText="关闭"
        okText="确认"
        onCancel={() => setVisible(false)}
        onOk={handleHealthState}
        visible={visible}
        width={1000}
        closable={false}
      >
        <p style={{fontSize:24,margin:0,color:'rgb(193, 42, 42)'}}>是否修改该人员健康状态?</p>
      </Modal>
    </div>
    </div>
  );
};
