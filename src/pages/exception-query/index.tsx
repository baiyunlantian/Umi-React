import React, { useEffect, useState, useRef } from 'react';
import { Pagination, Modal, message } from 'antd';
import WrappedSearchArea from '@/pages/components/searchArea';
import BaseForm from '@/pages/components/base-form';
import ExceptionPerson from './components/exception-person';
import ExceptionInfoStatistics from '@/pages/exception-query/components/exceptionInfoStatistics';
import ExceptionRoleAnalyze from '@/pages/exception-query/components/exceptionRoleAnalyze';
import {
  getExceptionInfo,
  getExceptionPersonList,
  updateExceptionPersonStatus,
  delExceptionPerson
} from '@/services/exception';
import styles from './index.less';
import { useModel } from 'umi';
import { selectClassFuzzyDownList } from '@/services/class';


export default props => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));

  const baseForm = useRef();
  const { dispatch, exceptionTotal } = props;
  const [exceptionStaticsInfo, setExceptionStaticsInfo] = useState({});
  const [exceptionPersonList, setExceptionPersonList] = useState([]);
  const [customPageSize, setCustomPageSize] = useState<number>(window.innerWidth <= 1024 ? 6 : 8);
  const [paginationProps, setPaginationProps] = useState({
    hideOnSinglePage: true,
    current: 1,
    pageSize: customPageSize,
    total: 0,
  });

  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [exceptionPersonId, setExceptionPersonId] = useState(0);
  const [accessId, setAccessId] = useState(0);
  const [operationType, setOperationType] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [formList, setFormList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [filterClassList, setFilterClassList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const { getDormitory } = useModel('dormitory');
  const { getCommon } = useModel('role');

  useEffect(()=>{

    getCommon().then(res=>setRoleList(res));

    getExceptionInfo().then(res=>{
      // console.log(res);
      setExceptionStaticsInfo(res.data);
    });

    search({
      pageNum: 1,
      pageSize: customPageSize,
    });

  },[]);

  useEffect(()=>{
    window.addEventListener('resize', (event)=>{
      const size =  event.target.innerWidth <= 1024 ? 6 : 8;
      setCustomPageSize(size);
    });
  },[]);

  const search = async (params:any = {pageNum: 1, pageSize: customPageSize,}, searchParams?:any) => {
    setSearchParams(searchParams)
    let _searchParams;

    if (searchParams){
      Object.keys(searchParams).forEach(key=>{
        if (searchParams[key] == null || searchParams[key] == undefined || searchParams[key] === ''){
          delete searchParams[key];
        }
      });
    }

    if (searchParams) {
      _searchParams = JSON.parse(JSON.stringify(searchParams));
      if (_searchParams.createTime && _searchParams.createTime.length > 0) {
        _searchParams.startTime = _searchParams.createTime[0].slice(0,10)+' 00:00:00';
        _searchParams.endTime = _searchParams.createTime[1].slice(0,10)+' 00:00:00';
        delete _searchParams.createTime;
      }
    } else {
      _searchParams = searchParams;
    }
    const values = {
      ..._searchParams,
      ...params,
    };
    values.classCode ? values.classCode = Number(values.classCode) : '';
    const {data}= await getExceptionPersonList(values);
    if (data){
      const { list, page} = data;
      setPaginationProps({
        hideOnSinglePage: true,
        current: page.pageNum,
        pageSize: customPageSize,
        total: page.total,
      });
      setExceptionPersonList(list);
    }else {
      setExceptionPersonList([]);
    }
  };

  const onOk = async () => {
    const values = baseForm.current.getFormValues();
  };


  const handlePageChange = (pageNum, pageSize) => {
    search({ pageNum, pageSize:customPageSize }, searchParams);
  };

  const showConfirmModal = (operationType:string, personId:number,accessId:number) => {
    setConfirmVisible(true);
    setOperationType(operationType);
    setExceptionPersonId(personId);
    setAccessId(accessId);
  };

  const confirmOperation = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    if (operationType === 'update'){
      let isDeal = 0;
      const list = exceptionPersonList.map((item) => {
        const data = JSON.parse(JSON.stringify(item));
        if(exceptionPersonId == data.personId && accessId == data.accessId) {
          if (data.isDeal == 0){
            data.isDeal = 1;
            isDeal = 1;
          }else{
            data.isDeal = 0;
          }
        }
        return data
      });
      updateExceptionPersonStatus({personId:exceptionPersonId,accessId,isDeal}).then(res=>{
        if (res.data) setExceptionPersonList(list);
        setConfirmVisible(false);
      });
    }else {
      delExceptionPerson({personId:exceptionPersonId,accessId}).then(res=>{
        const list = exceptionPersonList.map((item) => {
          if(accessId != item.accessId && exceptionPersonId == item.personId) {
            return item;
          }
        });
        setExceptionPersonList(list);
        setConfirmVisible(false);
      });
    }
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

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 16 }
    }
  };

  const formProps = {
    hiddenFooter: true,
    initialValues,
    formList,
  };

  //访客表单
  const visitorFormList = [
      { name: 'name', label: '姓名', type: 'input' },
      { name: 'sex', label: '性别', type: 'input', },
      { name: 'ipNum', label: '身份证号', type: 'input' },
      { name: 'phone', label: '手机号', type: 'input' },
      { name: 'roleName', label: '角色', type: 'input' },
      { name: 'arriveTime', label: '访问时间', type: 'input' },
      { name: 'reason', label: '访问事由', type: 'textarea',  className: styles.textarea},
      { name: 'temp', label: '体温', type: 'input' },
      { name: 'checkTime', label: '测量日期', type: 'input' },
      { name: 'remark', label: '备注', type: 'input' },
      { name: 'isDeal', label: '状态', type: 'input' },
  ];

  //学生表单
  const studentFormList = [
      { name: 'name', label: '姓名', type: 'input' },
      { name: 'sex', label: '性别', type: 'input', },
      { name: 'ipNum', label: '身份证号', type: 'input' },
      { name: 'phone', label: '手机号', type: 'input' },
      { name: 'roleName', label: '角色', type: 'input' },
      { name: 'className', label: '所在班级', type: 'input' },
      { name: 'code', label: '学号', type: 'input', },
      { name:'dormitoryName', label:'宿舍', type:'input', },
      { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea  },
      { name: 'teacherName', label: '班主任', type: 'input' },
      { name: 'teacherPhone', label: '联系方式', type: 'input' },
      { name: 'temp', label: '体温', type: 'input' },
      { name: 'checkTime', label: '测量日期', type: 'input' },
      { name: 'isDeal', label: '状态', type: 'input' },

  ];

  //教师表单
  const teacherFormList = [
      { name: 'name', label: '姓名', type: 'input' },
      { name: 'sex', label: '性别', type: 'input', },
      { name: 'ipNum', label: '身份证号', type: 'input' },
      { name: 'phone', label: '手机号', type: 'input' },
      { name: 'roleName', label: '角色', type: 'input' },
      { name: 'station', label: '岗位', type: 'input' },
      { name: 'code', label: '工号', type: 'input', },
      { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea },
      { name: 'temp', label: '体温', type: 'input' },
      { name: 'checkTime', label: '测量日期', type: 'input' },
      { name: 'isDeal', label: '状态', type: 'input' },
  ];

  //后勤表单
  const logisticsFormList = [
      { name: 'name', label: '姓名', type: 'input' },
      { name: 'sex', label: '性别', type: 'input', },
      { name: 'ipNum', label: '身份证号', type: 'input' },
      { name: 'phone', label: '手机号', type: 'input' },
      { name: 'roleName', label: '角色', type: 'input' },
      { name: 'code', label: '工号', type: 'input' },
      { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea},
      { name: 'temp', label: '体温', type: 'input' },
      { name: 'checkTime', label: '测量日期', type: 'input' },
      { name: 'isDeal', label: '状态', type: 'input' },
  ];


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
        options: roleList
      },
      {
        name: 'createTime',
        label: '日期',
        type: 'range-picker',
      },
      {
        name:'isDeal',
        type: 'radio',
        label: '状态',
        options: [
          { key: 0, label: '未处理' },
          { key: 1, label: '已处理' },
        ],
      }
    ],
    handleSearch: (values:string) => search({pageNum: 1, pageSize: customPageSize,}, values),
  };
  const handleVisible = (visible:boolean,roleId:number,accessId:number) => {
    setVisible(visible);
    exceptionPersonList.map(item=>{
      const data = JSON.parse(JSON.stringify(item));
      if (data.accessId == accessId){
        Object.keys(data).forEach(key=>{
          data[key] == null || data[key] == '' ? data[key] = ' ' : '';

          if (key == 'sex'){
            data[key] == 0 ? data[key] = '女' : data[key] = '男';
          }

          if (key == 'isDeal'){
            data[key] == 0 ? data[key] = '未处理' : data[key] = '已处理';
          }

        });
        setInitialValues(data);
      }
    });

    if (roleId === 1){
      setFormList(studentFormList);
    }else if (roleId === 2){
      setFormList(teacherFormList);
    }else if (roleId === 3){
      setFormList(logisticsFormList);
    } else if (roleId === 4){
      setFormList(visitorFormList);
    }else {
      setFormList(studentFormList);
    }

  };

  //异常人员信息
  const exceptionPersonProps = {
    handleVisible,
    showConfirmModal,
    exceptionPersonList
  };


  return (
    <div className='custom-main-content'>
      <div className={styles.exceptionQuery}>

      <div className={styles.exceptionInfo}>

        <ExceptionInfoStatistics realTimeExceptionCount={paginationProps.total} {...exceptionStaticsInfo} />

        <ExceptionRoleAnalyze />


      </div>

      <div className={styles.searchForm}>
        <WrappedSearchArea {...searchProps} />
      </div>

      <div className={styles.exceptionItems}>
        <ExceptionPerson  {...exceptionPersonProps} />
      </div>

      <div className={styles.pagination}>
        <div>共{paginationProps.total}条</div>
        <Pagination
          showSizeChanger={false}
          {...paginationProps}
          className={styles.pagination_btn}
          onChange={handlePageChange}
        />
      </div>

      <Modal
        className={styles.infoModal}
        title="异常信息详情"
        cancelText="关闭"
        okText="确认"
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        visible={visible}
        closable={false}
      >
        <div className={styles.img}>
          <img src={initialValues.url || ''}/>
        </div>
        <BaseForm
          ref={baseForm}
          {...formProps}
          formItemLayout={formItemLayout}
        />
      </Modal>

      {/*  确认 删除/修改 状态框*/}
      <Modal
        className={styles.confirmModal}
        visible={confirmVisible}
        onOk={confirmOperation}
        onCancel={() => {setConfirmVisible(false)}}
        okText='确认'
        cancelText='取消'
        closable={false}
      >
        {
          operationType === 'del'
            ?
            <p style={{fontSize:24,margin:0,color:'rgb(193, 42, 42)'}}>是否删除该人员信息?</p>
            :
            <p style={{fontSize:24,margin:0,color:'rgb(193, 42, 42)'}}>是否修改该人员状态?</p>
        }
      </Modal>

    </div>
    </div>
  );
};
