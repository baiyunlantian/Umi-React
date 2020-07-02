import React, { useEffect, useState, useRef } from 'react';
import SearchArea from '@/pages/components/searchArea';
import CustomTable from '@/pages/components/custom-table';
import { getDeviceStatisticsInfo, updateTerminal, unbindTerminal, terminalOperate } from '@/services/device';
import {Link} from 'umi';
import {Modal, message} from 'antd';
import DeviceCreate from './components/device-create';
import moment from 'moment';
import runningImg from '@/assets/device/running.png';
import notRunImg from '@/assets/device/notRun.png';
import problemImg from '@/assets/device/problem.png';
import fixingImg from '@/assets/device/fixing.png';
import restartImg from '@/assets/device/restart.png';
import delImg from '@/assets/exception-query/del.png';
import editImg from '@/assets/exception-query/edit.png';
import {useModel} from "@/.umi/plugin-model/useModel";
import styles from './index.less';

export default () => {
  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const [editVisible, setEditVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [deviceInfo, setDeviceInfo] = useState({
    running:0,
    stop:0
  });
  const [searchValues, setSearchValues] = useState({})
  const customTable = useRef();
  const campusId = JSON.parse(localStorage.getItem('currentCampus')!).campusId;

  useEffect(()=>{
    getDeviceStatisticsInfo({campusId}).then(res=>{
      if (res.data){
        setDeviceInfo(res.data);
      }
    });

  },[]);

  const handleSearch = values => {
    if(values.status  ) {
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
    }
    setSearchValues(values)
    customTable.current.search(values);
  };
  // 删除
  const handleDelete = (record: object) => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    Modal.confirm({
      title: `确定要删除${record.name || ''}吗`,
      content: '请谨慎操作',
      onOk: () => {
        unbindTerminal({id : record.id});
        customTable.current.search(searchValues);
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  // 重启
  const handleOperate = (record: object) => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    Modal.confirm({
      title: `确定要重启${record.name || ''}吗`,
      onOk: () => {
        terminalOperate({id : record.id, operateType:"9"}).then((res) => {
          res.data ? message.info('重启成功') : message.info('重启失败');
        })
        customTable.current.search(searchValues);
      },
      okText: '确定',
      cancelText: '取消',
    });
  }

  const searchProps = {
    handleSearch,

    searchForm: [
      { name: 'ip', label: 'IP', type: 'input' },
      { name: 'locationType', label: '位置', type: 'select',
        options:[
          { key:0,label:'校园' },
          { key:1,label:'寝室' },
          { key:2,label:'其它' }
        ]},
      { name: 'access', label: '出入口', type: 'select',
        options:[
          {
            key:'0',label:'入口'
          },
          {
            key:'1',label:'出口'
          }
        ]
      },
      { name: 'areaName', label: '详细位置', type: 'input' },
      {
        name:'status',
        type: 'radio',
        label: '设备状态',
        options: [
          { key: '0', label: '未开启' },
          { key: '1', label: '运行中' },
          { key: '2', label: '故障' },
          { key: '3', label: '维护中' },
        ],
      },
    ],
  };


  //设备列表
  const tableProps = {
    url: '/api/data/terminal/terminalList',
    params: {
      campusId
    },
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: 'IP',
          dataIndex: 'ip',
          width: '10%',
          editable: true,
          key: 'ip',
        },
        {
          title: '位置',
          dataIndex: 'locationType',
          width: '7%',
          editable: true,
          key: 'locationType',
          render: (text) => (<div>{text == 0 ? '校园' : text === 1 ? '寝室' : '其它'}</div>)
        },
        {
          title: '出入口状态',
          dataIndex: 'access',
          width: '12%',
          editable: true,
          key: 'access',
          render: (text) => (<div>{text === 1 ? '出口' : '入口'}</div>)
        },
        {
          title: '楼栋',
          dataIndex: 'dormitoryName',
          width: '10%',
          editable: true,
          key: 'dormitoryName',
          render: (text,record) => (<div>{record.locationType === 1 ? text : ''}</div>)
        },
        {
          title: '详细位置',
          dataIndex: 'areaName',
          width: '10%',
          editable: true,
          key: 'areaName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '15%',
          editable: true,
          key: 'createTime',
          render: text => (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
        },
        {
          title: '端口',
          dataIndex: 'port',
          width: '8%',
          editable: true,
          key: 'port',
        },
        {
          title: '设备状态',
          dataIndex: 'status',
          width: '10%',
          editable: true,
          key: 'status',
          render : (text, item ) => {
            if (item.running === 1 && text === 0){
              return <div style={{color:'#27cc27'}}>运行中</div>
            }else if(item.running === 0 && text === 0){
              return <div>未开启</div>
            }else if(text === 1){
              return <div style={{color:'red'}}>故障</div>
            }else if(text === 2){
              return <div style={{color:'rgb(234, 141, 52)'}}>维护中</div>
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '15%',
          render: (text, record) => (
            <div className={styles.operation}>
              <img
                src={editImg}
                alt='编辑'
                onClick={( ) => {
                  record = {...record};
                  if (record.status === 0 && record.running === 0){
                    record.status = 0;
                  }else if(record.status === 0 && record.running === 1){
                    record.status = 1;
                  }else if(record.status === 2){
                    record.status = 3;
                  }else if(record.status === 3){
                    record.status = 4;
                  }
                  setInitialValues(record);
                  setEditVisible(true);
                }}
              />
              <img
                src={restartImg}
                alt='重启'
                onClick={() =>{
                  handleOperate(record);
                }}
              />
              <img
                src={delImg}
                alt='删除'
                onClick={() => {
                  handleDelete(record);
                }}
              />
            </div>
          ),
        },
      ],
    },
  };

  // 编辑
  const deviceEditProps = {
    visible: editVisible,
    handleVisible: () => {
      setEditVisible(false);
    },
    initialValues: initialValues,
    onSubmit: (values) => {
      if (campus.campusId == null){
        message.info('非本校区无操作权限!');
        return;
      }
      setEditVisible(false);
      Object.keys(values).forEach(key=>{
        if (values[key] == null || values[key] == undefined || values[key] === ''){
          delete values[key];
        }
      });
      updateTerminal(values).then((res) => {
        if (res.data){
          message.success('修改成功!');
          customTable.current.search(searchValues);
        }
      })
    },
  };


  return (
    <div className='custom-main-content'>
      <div className={styles.deviceManagement}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.title}>
            <div className={styles.text}>设备统计</div>
          </div>
          <div className={styles.des}>
            <div className={styles.total}>总数：<span>{(deviceInfo.running + deviceInfo.stop) || 0}</span>台</div>
            <div className={styles.running}>
              <img src={runningImg} alt='运行中' />
              运行中：<span>{deviceInfo.running || 0}</span>台
            </div>
            <div className={styles.notRun}>
              <img src={notRunImg} alt='未开启' />
              未开启：<span>{deviceInfo.stop || 0}</span>台
            </div>
            <div className={styles.problem}>
              <img src={problemImg} alt='故障' />
              故障：<span>{deviceInfo.trouble || 0}</span>台
            </div>
            <div className={styles.fixing}>
              <img src={fixingImg} alt='维护中' />
              维护中：<span>{deviceInfo.maintain || 0}</span>台
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <Link className={styles.normal} to='device-management/detail'>终端<br />设置</Link>
        </div>
      </div>
      <SearchArea {...searchProps} />
      <CustomTable ref={customTable} {...tableProps} />
      <DeviceCreate {...deviceEditProps} />
    </div>
    </div>
  );
};
