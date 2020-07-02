import React, { useEffect, useState, useRef } from 'react';
import SearchArea from '@/pages/components/searchArea';
import CustomTable from '@/pages/components/custom-table';
import SvgIcon from '@/components/svg/icon';
import styles from './index.less';
import {
  getRealTimeVisitorInfo,
  dealWaitAuditList,
  deleteAppointmentRecode,
  updateAppointment,
  updateVisitorStatus
} from '@/services/visitor';
import BaseForm from '@/pages/components/base-form';
import { Modal, message, Button } from 'antd';
import Upload from '@/pages/components/upload';
import { unbindTerminal } from '@/services/device';


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

  const [visitorInfo, setVisitorInfo] = useState({});
  const [tableType, setTableType] = useState('visitors');
  const [searchForm, setSearchForm] = useState([]);
  const [ymd, setYmd] = useState(0);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [batchAuditActive, setBatchAuditActive] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [file, setFile] = useState('');
  const [customPageSize, setCustomPageSize] = useState<number>(window.innerWidth <= 1024 ? 5 : 10);
  const customTable = useRef();
  const baseForm = useRef();

  useEffect(()=>{
    tableType == 'visitors' ? setSearchForm(isVisitorSearchForm) : setSearchForm(notVisitorSearchForm);

    getRealTimeVisitorInfo({ymd}).then(res=>{
      if (res.data){
        setVisitorInfo(res.data);
      }
    });
  },[]);

  useEffect(()=>{
    window.addEventListener('resize', (event)=>{
      const {innerWidth} = event.target;
      const size = innerWidth <= 1024 ? 5 : 10;
      setCustomPageSize(size);
    });
  },[]);

  const selectTime = (ymd:number) => {
    setYmd(ymd);
    getRealTimeVisitorInfo({ymd}).then(res=>{
      if (res.data){
        setVisitorInfo(res.data);
      }
    });
  };

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
    hiddenFooter: true,
    initialValues:record,
    formList:[
      { name: 'name', label: '姓名', type: 'input' },
      { name: 'sex', label: '性别', type: 'select', options:[
        {key: '0', label: '男'},
        {key: '1', label: '女'}
      ] },
      { name: 'ipNum', label: '身份证号', type: 'input' },
      { name: 'phone', label: '手机号', type: 'input' },
      { name: 'reason', label: '访问事由', type: 'textarea',className:styles.textarea },
    ],
  };

  const onOk = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = baseForm.current.getFormValues();
    const formData = new FormData();

    if (!(values.name && values.ipNum && values.phone && (values.sex == 0 || values.sex == 1))){
      message.error('缺少必要信息');
      return;
    }

    Object.keys(values).forEach(key=>values[key] ? formData.append(key,values[key]) :'');
    formData.append('personId',record.personId);
    formData.append('campusId', campusId);
    formData.append('schoolId', schoolId);
    file ? formData.append('file', file) : '';

    updateAppointment(formData).then(res=>{
      if (res.data){
        message.success('更新成功');
        setVisible(false);
        customTable.current.search({});
      }
    });
  };

  const handleSearch = values => {
    if (values.createTime && values.createTime.length > 0){
      values.startTime = values.createTime[0].format('YYYY-MM-DD');
      values.endTime = values.createTime[1].format('YYYY-MM-DD');
      delete values.createTime;
    }

    Object.keys(values).forEach(key=>{
      if (values[key] == null || values[key] == undefined || values[key] === ''){
        delete values[key];
      }
    });
    customTable.current.search(values);
  };

  let batchAuditList = [];
  const batchSelectAuditTable = (key,row) => {
    batchAuditList = JSON.parse(JSON.stringify(row));
  };

  const isVisitorSearchForm = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'createTime', label: '日期', type: 'range-picker'},
    {
      name:'type',
      type: 'radio',
      label: '通行方式',
      options: [
        { key: 0, label: '访客预约' },
        { key: 1, label: '人证合一' },
      ],
    },
    {
      name:'bodyState',
      type: 'radio',
      label: '状态',
      options: [
        { key: 0, label: '正常' },
        { key: 1, label: '异常' },
      ],
    }
  ];

  const notVisitorSearchForm = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'createTime', label: '来访日期', type: 'range-picker'},
  ];

  const searchProps = {
    handleSearch,
    searchForm,
  };

  //来访人员列表
  const visitorsTableProps = {
    url: '/api/visitor/selectListIsArrive',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: '照片',
          dataIndex: 'url',
          width: '10%',
          editable: true,
          key: 'url',
          render : (text) => (<img src={text} alt='***' />)
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '5%',
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
          width: '10%',
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
          title: '通行方式',
          dataIndex: 'type',
          width: '10%',
          editable: true,
          key: 'type',
          render : (text) => (<div>{text == 0 ? '访客预约' : '人证合一'}</div>)
        },
        {
          title: '来访时间',
          dataIndex: 'arriveTime',
          width: '10%',
          editable: true,
          key: 'arriveTime',
          render:text => (<div>{text && text.length > 0 ? text.slice(5) : ''}</div>)
        },
        {
          title: '体温',
          dataIndex: 'temp',
          width: '5%',
          editable: true,
          key: 'temp',
          render : (text, item) => {
            return (<div style={item.bodyState == 0 ? {color:'white'} : {color:'red'}}>{text === null ? '暂无' : text}</div>)
          }
        },
        {
          title: '状态',
          dataIndex: 'bodyState',
          width: '5%',
          editable: true,
          key: 'bodyState',
          render : (text) => (<div style={text == 0 ? {color:'white'} : {color:'red'}}>{text === 0 ? '正常' : '异常'}</div>)
        },
        {
          title: '离开时间',
          dataIndex: 'leaveTime',
          width: '10%',
          editable: true,
          key: 'leaveTime',
          render:text => (<div>{text && text.length > 0 ? text.slice(5) : ''}</div>)
        },
        {
          title: '访问事由',
          dataIndex: 'reason',
          width: '10%',
          editable: true,
          key: 'reason',
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              {
                record.bodyState == 1
                  ?
                  <SvgIcon
                    tipTitle='编辑'
                    name='update'
                    width={25}
                    height={25}
                    color="rgb(56, 220, 255)"
                    onClick={() => handleUpdateVisitors(record)}
                  />
                  :''
              }
            </div>
          ),
        },
      ],
    },
  };

  //预约人员列表
  const appointmentTableProps = {
    url: '/api/visitor/selectListIsVerify',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: '照片',
          dataIndex: 'url',
          width: '10%',
          editable: true,
          key: 'url',
          render : (text) => (<img src={text} alt='***' />)
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '8%',
          editable: true,
          key: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: '8%',
          editable: true,
          key: 'sex',
          render : (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '10%',
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
          title: '预约时间',
          dataIndex: 'sendTime',
          width: '10%',
          editable: true,
          key: 'sendTime',
          render:text => (<div>{text && text.length > 0 ? text.slice(5) : ''}</div>)
        },
        {
          title: '预约来访时间',
          dataIndex: 'startVisitTime',
          width: '15%',
          editable: true,
          key: 'startVisitTime',
          render : (text,record) => (<div>{text && text.length > 0 ? text.slice(5) : ''}--{record.endVisitTime && record.endVisitTime.substring(11)}</div>)
        },
        {
          title: '访问事由',
          dataIndex: 'reason',
          width: '15%',
          editable: true,
          key: 'reason',
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              <SvgIcon
                tipTitle='编辑'
                name='update'
                width={25}
                height={25}
                color="rgb(56, 220, 255)"
                onClick={() => {
                  setVisible(true);
                  setRecord(record);
                }}
              />
              <SvgIcon
                tipTitle='删除'
                name='delete'
                width={25}
                height={25}
                color="rgb(56, 220, 255)"
                onClick={() => handleDeleteAppointment(record.personId)}
              />
            </div>
          ),
        },
      ],
    },
  };

  //待审核人员列表--单选
  const waitAuditTableProps = {
    url: '/api/visitor/selectListNotVerify',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: '照片',
          dataIndex: 'url',
          width: '10%',
          editable: true,
          key: 'url',
          render : (text) => (<img src={text} alt='***' />)
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '8%',
          editable: true,
          key: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: '8%',
          editable: true,
          key: 'sex',
          render : (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '10%',
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
          title: '预约时间',
          dataIndex: 'sendTime',
          width: '10%',
          editable: true,
          key: 'sendTime',
          render:text => (<div>{text && text.length > 0 ? text.slice(5) : ''}</div>)
        },
        {
          title: '来访时间',
          dataIndex: 'startVisitTime',
          width: '15%',
          editable: true,
          key: 'startVisitTime',
          render : (text,record) => (<div>{text && text.length > 0 ? text.slice(5) : ''}--{record.endVisitTime && record.endVisitTime.substring(11)}</div>)
        },
        {
          title: '访问事由',
          dataIndex: 'reason',
          width: '15%',
          editable: true,
          key: 'reason',
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              <SvgIcon
                tipTitle='审核通过'
                name='passAudit'
                width={25}
                height={25}
                color="rgb(5, 211, 93)"
                onClick={() => handleWaitAudit(record,0)}
              />
              <SvgIcon
                tipTitle='审核拒绝'
                name='refuseAudit'
                width={25}
                height={25}
                color="rgb(255,0,0)"
                onClick={() => handleWaitAudit(record,1)}
              />
            </div>
          )
        },
      ],
    },
  };

  //待审核人员列表--批量选择
  const checkboxWaitAuditTableProps = {
    url: '/api/visitor/selectListNotVerify',
    pageSize:customPageSize,
    tableFields: {
      rowSelection:{
        type:'checkbox',
        onChange:batchSelectAuditTable
      },
      rowKey: 'personId',
      columns: [
        {
          title: '照片',
          dataIndex: 'url',
          width: '10%',
          editable: true,
          key: 'url',
          render : (text) => (<img src={text} alt='***' />)
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '8%',
          editable: true,
          key: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: '8%',
          editable: true,
          key: 'sex',
          render : (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '10%',
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
          title: '预约时间',
          dataIndex: 'sendTime',
          width: '10%',
          editable: true,
          key: 'sendTime',
          render:text => (<div>{text && text.length > 0 ? text.slice(5) : ''}</div>)
        },
        {
          title: '来访时间',
          dataIndex: 'startVisitTime',
          width: '15%',
          editable: true,
          key: 'startVisitTime',
          render : (text,record) => (<div>{text && text.length > 0 ? text.slice(5) : ''}--{record.endVisitTime && record.endVisitTime.substring(11)}</div>)
        },
        {
          title: '访问事由',
          dataIndex: 'reason',
          width: '15%',
          editable: true,
          key: 'reason',
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          className:'batchTd',
          render: (text, record,index) => {
            const obj = {
              children: <div className={styles.operation}>
                <SvgIcon
                  tipTitle='审核通过'
                  name='passAudit'
                  width={25}
                  height={25}
                  color="rgb(5, 211, 93)"
                  onClick={() => handleBatchWaitAudit(0)}
                />
                <SvgIcon
                  tipTitle='审核拒绝'
                  name='refuseAudit'
                  width={25}
                  height={25}
                  color="rgb(255,0,0)"
                  onClick={() => handleBatchWaitAudit(1)}
                />
              </div>,
              props: {
                rowSpan:0
              },
            };

            if (index === 0) {
              obj.props.rowSpan = 10;
            }else {
              obj.props.rowSpan = 0;
            }

            return obj;
          }
        },
      ],
    },
  };

  const handleUpdateVisitors = ({personId,accessId,bodyState,name}) => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    Modal.confirm({
      title: `确定要修改${name || ''}的状态吗`,
      content: '请谨慎操作',
      onOk: () => {
        updateVisitorStatus({personId,accessId,bodyState}).then(res=>{
          if (res.data){
            message.success('修改成功');
            customTable.current.search({});
          }
        });
      },
      okText: '确定',
      cancelText: '取消',
    });

  };

  const handleTableToggle = (tableType: string) => {
    setTableType(tableType);
    tableType == 'visitors' ? setSearchForm(isVisitorSearchForm) : setSearchForm(notVisitorSearchForm);
  };

  const handleWaitAudit =  ({personId},state:number) => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    dealWaitAuditList({list:[personId],state}).then(res=>{
      if (res.data){
        message.success('审核完成！',2);
        customTable.current.search({});
      }else {
        message.error('审核失败！',2);
      }if (res.data){
        customTable.current.search({});
      }
    });
  };

  const handleBatchWaitAudit = (state:number) => {
    const personId = [];
    if (batchAuditList && batchAuditList.length > 0){
      batchAuditList.map(item=>{
        personId.push(item.personId);
      });
      dealWaitAuditList({list:personId,state}).then(res=>{
        if (res.data){
          message.success('审核完成！',2);
          customTable.current.search({});
        }else {
          message.error('审核失败！',2);
        }
      });
    }
  };

  const handleDeleteAppointment = (personId:any) => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    Modal.confirm({
      title: `确定要删除该预约信息吗`,
      content: '请谨慎操作',
      onOk: () => {
        deleteAppointmentRecode({personId}).then(res=>{
          if (res.data){
            customTable.current.search({});
          }
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const uploadOption = {
    name: 'logo1',
    accept: 'image/*',
    headers: {
      token: localStorage.getItem('token'),
    },
    fileList: [],
    setImageUrl: (url,file) => {
      setImgUrl(url);
      setFile(file);
    },
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.visitorsManagement}>
        <div className={styles.top}>
          <div className={styles.left}>
            <div className={styles.title}>
              <div className={styles.text}>今日实时访客统计</div>
              <div className={styles.time}>
                <span className={ymd == 1 ? styles.active : ''} onClick={()=>selectTime(1)}>月|</span>
                <span className={ymd == 0 ? styles.active : ''} onClick={()=>selectTime(0)}>日</span>
              </div>
            </div>
            <div className={styles.des}>
              <div className={styles.visitors}>
                <div className={styles.count}>来访人数<span>{visitorInfo.isArrive || 0}</span>人</div>
                <div className={styles.present}>环比<span>{visitorInfo.ratioArrive || 0}</span></div>
              </div>
              <div className={styles.appointment}>
                <div className={styles.count}>预约人数<span>{visitorInfo.isVerify || 0}</span>人</div>
                <div className={styles.present}>环比<span>{visitorInfo.ratioVerify || 0}</span></div>
              </div>
              <div className={styles.audit}>
              <div className={styles.count}>今日待审核人数<span>{visitorInfo.notVerify || 0}</span>人</div>
            </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={tableType === 'visitors' ? styles.active : styles.normal} onClick={() => handleTableToggle('visitors')}>来访<br />人员列表</div>
            <div className={tableType === 'appointment' ? styles.active : styles.normal} onClick={() => handleTableToggle('appointment')}>预约<br />信息列表</div>
            <div className={tableType === 'audit' ? styles.active : styles.normal} onClick={() => handleTableToggle('audit')}>待审核<br />访客列表</div>
          </div>
        </div>
        <SearchArea {...searchProps}>
          {
            tableType === 'audit'
            ?
              <div
                className={batchAuditActive ? styles.defaultStyleBtn : styles.defaultCancelBtn}
                onClick={()=>{setBatchAuditActive(!batchAuditActive)}}
              >
                批量审核
              </div>
              : ''
          }
        </SearchArea>
        {tableType === 'visitors' ? <CustomTable ref={customTable} {...visitorsTableProps} /> : ''}
        {tableType === 'appointment' ? <CustomTable ref={customTable} {...appointmentTableProps} /> : ''}
        {tableType === 'audit'
          ? batchAuditActive
              ? <CustomTable ref={customTable} {...checkboxWaitAuditTableProps} />
              : <CustomTable ref={customTable} {...waitAuditTableProps} />
          : ''}

        <Modal
          className={styles.infoModal}
          title="预约人员信息"
          cancelText="关闭"
          okText="确认"
          onCancel={() => {
            setVisible(false);
            setImgUrl('');
          }}
          onOk={onOk}
          visible={visible}
          closable={false}
        >
          <div className={styles.studentUpload}>
            <div className={styles.Upload}>
              <img
                width="100%"
                height="100%"
                src={imgUrl || record.url}
                alt=""
                draggable={false}
              />
            </div>
            <Upload {...uploadOption}>
              <Button className={styles.btnUpload}>上传照片</Button>
            </Upload>
          </div>
          {/*<div className={styles.img}>*/}
          {/*  <img src={record.url || ''} alt='***'/>*/}
          {/*</div>*/}
          <BaseForm
            ref={baseForm}
            {...formProps}
            formItemLayout={formItemLayout}
          />
        </Modal>

      </div>
    </div>
  );
};
