import React, { useState, useRef, useEffect, Fragment } from 'react';
import CustomTable from '@/pages/components/custom-table';
import styles from './history-query.less';
import WrappedSearchArea from '@/pages/components/searchArea';
import ClassInfo from './components/classInfo';
import Building from './components/building';
import {
  getAttendanceClassInfo,
  getAttendanceDormitoryInfo,
  exportSingleDormitoryAttendance,
  exportClassAttendance,
} from '@/services/attendance';
import {Link, history} from 'umi';
import {message} from 'antd';
import { downloadFileByBlob } from '@/utils/common';
import { selectClassFuzzyDownList } from '@/services/class';
import { useModel } from '@@/plugin-model/useModel';
import moment from 'moment';

export default (props) => {

  const {type} = props.location.query;

  const [info, setInfo] = useState({});
  const [census, setCensus] = useState({
    ratioAttendance:0,
    ratioLate:0,
    ratioLeave:0,
    attendanceNum:0,
    normalAttendanceNum:0,
    lateAttendanceNum:0,
    leaveAttendanceNum:0
  });
  const [haveRule, setHaveRule] = useState<boolean>(false);
  const [filterClassList, setFilterClassList] = useState([]);
  const [dormitoryList, setDormitoryList] = useState([]);
  const [classCode, setClassCode] = useState(null);
  const [dormitoryCode, setDormitoryCode] = useState(null);
  const { getDormitory } = useModel('dormitory');

  useEffect(()=>{
    {type == 'campus' ? '' : getDormitory().then(list => setDormitoryList(list))}
  },[]);

  const customTable = useRef();
  const formRef = useRef();
  const handleSearch = (values: object) => {
    Object.keys(values).forEach(key=> values[key] ? '' : delete values[key]);
    if (values.createTime && values.createTime.length > 0){
      values.startTime = values.createTime[0].format('YYYY-MM-DD') + ' 00:00:00';
      values.endTime = values.createTime[1].format('YYYY-MM-DD') + ' 00:00:00';
      delete values.createTime;
    }
    values.classCode ? values.classCode = Number(values.classCode) : '';
    values.dormitoryCode ? values.dormitoryCode = Number(values.dormitoryCode) : '';
    values.classCode ? setClassCode(Number(values.classCode)) : '';
    values.dormitoryCode ? setDormitoryCode(Number(values.dormitoryCode)) : '';
    customTable.current.search(values);
    //班级考勤查询
    if (type == 'campus') {
      getAttendanceClassInfo(values).then(res => {
        if (!res.data) return;
        const {haveRule} = res.data;
        setHaveRule(haveRule);
        if (haveRule) {
          const { classCensus, classInfo } = res.data;
          setCensus(classCensus);
          setInfo(classInfo);
        }
      });
    }//寝室考勤查询
    else {
      getAttendanceDormitoryInfo(values).then(res=>{
        if (!res.data) return;
        const {haveRule} = res.data;
        setHaveRule(haveRule);
        if (haveRule) {
          const { dormitoryCensus, dormitory } = res.data;
          setCensus(dormitoryCensus);
          setInfo(dormitory);
        }
      });
    }
  };

  const exportExcl = async () => {
    message.loading('正在生成文件...');
    if (type == 'campus'){
      // 导出excel
      const blobContent = await exportClassAttendance(customTable.current.getData());
      downloadFileByBlob(blobContent, '班级考勤统计表格.xls');
    }else {
      const blobContent = await exportSingleDormitoryAttendance(customTable.current.getData());
      downloadFileByBlob(blobContent, '楼栋考勤统计表格.xls');
    }
  };

  const infoProps = {
    info,
    census,
    haveRule
  };

  const toDetailPage = (personId:number, dormitoryCode:any) => {
    const values = formRef.current.getFieldsValue();
    if (values.createTime && values.createTime.length > 0){
      values.startTime = values.createTime[0];
      values.endTime = values.createTime[1];
      delete values.createTime;
    }

    history.push({
      pathname:'/attendance-management/detail',
      query:{
        type,
        personId,
        dormitoryCode,
        ...values
      },
    })
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

  const campusSearchProps = {
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
        name: 'createTime',
        label: '日期',
        type: 'range-picker',
      },
      {
        name: 'exceptionState',
        label: '考勤状态',
        type: 'radio',
        options:[
          {key:0,label:'正常'},
          {key:1,label:'异常'}
        ]
      },
    ],
    handleSearch,
  };

  const dormitorySearchProps = {
    searchForm: [
      {
        name: 'dormitoryCode',
        label: '楼栋',
        type: 'select',
        options:dormitoryList
      },
      {
        name: 'createTime',
        label: '日期',
        type: 'range-picker',
      },
      {
        name: 'exceptionState',
        label: '考勤状态',
        type: 'radio',
        options:[
          {key:0,label:'正常'},
          {key:1,label:'异常'}
        ]
      },
    ],
    handleSearch,
  };

  //考勤历史查询班级列表
  const campusTableProps = {
    url: '/api/attendance/classInfo',
    pageSize:8,
    params:{
      classCode
    },
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          width: '15%',
          editable: true,
          key: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: '10%',
          editable: true,
          key: 'sex',
          render : (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '20%',
          editable: true,
          key: 'ipNum',
        },
        {
          title: '考勤次数',
          dataIndex: 'attendanceTimes',
          width: '10%',
          editable: true,
          key: 'attendanceTimes',
          render : (text,record) => (<div>{record.schoolCount + record.homeCount}</div>)
        },
        {
          title: '最后一次上学考勤',
          dataIndex: 'schoolTime',
          width: '15%',
          editable: true,
          key: 'schoolTime',
          render : (text) => (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
        },
        {
          title: '最后一次放学考勤',
          dataIndex: 'homeTime',
          width: '15%',
          editable: true,
          key: 'homeTime',
          render : (text) => (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div
              onClick={()=>toDetailPage(record.personId, null)}
              style={{fontWeight: 'bold',color:'rgb(0, 160, 233)',cursor:'pointer'}}
            >
              ···
            </div>
          ),
        },
      ],
    },
  };

  //考勤历史查询楼栋列表
  const dormitoryTableProps = {
    url: '/api/attendance/singleDormitoryAttendance',
    pageSize:8,
    params:{
      dormitoryCode
    },
    tableFields: {
      rowKey: 'personId',
      columns: [
        {
          title: '班级',
          dataIndex: 'className',
          width: '10%',
          editable: true,
          key: 'className',
        },
        {
          title: '学号',
          dataIndex: 'code',
          width: '5%',
          editable: true,
          key: 'code',
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
          title: '考勤次数',
          dataIndex: 'attendanceTimes',
          width: '5%',
          editable: true,
          key: 'attendanceTimes',
        },
        {
          title: '最后一次进入寝室',
          dataIndex: 'lastGotoSchoolTime',
          width: '15%',
          editable: true,
          key: 'lastGotoSchoolTime',
          render : (text) => (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
        },
        {
          title: '最后一次离开寝室',
          dataIndex: 'lastAfterSchoolTime',
          width: '15%',
          editable: true,
          key: 'lastAfterSchoolTime',
          render : (text) => (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div
              onClick={()=>toDetailPage(record.personId, record.dormitoryCode)}
              style={{fontWeight: 'bold',color:'rgb(0, 160, 233)',cursor:'pointer'}}
            >
              ···
            </div>
          ),
        },
      ],
    },
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.historyQuery}>
      {type == 'campus'
        ?
        <Fragment>
          <WrappedSearchArea ref={formRef} {...campusSearchProps} >
            <div className={styles.goBack} onClick={ () => {exportExcl()}}>导出表格</div>
            <div className={styles.goBack} onClick={ () => {history.goBack()}}>返回</div>
          </WrappedSearchArea>
          <ClassInfo {...infoProps} />
          { classCode ? <CustomTable ref={customTable} {...campusTableProps} /> : ''}
        </Fragment>
        :
        <Fragment>
          <WrappedSearchArea ref={formRef} {...dormitorySearchProps} >
            <div className={styles.goBack} onClick={ () => {exportExcl()}}>导出表格</div>
            <div className={styles.goBack} onClick={ () => {history.goBack()}}>返回</div>
          </WrappedSearchArea>
          <Building {...infoProps} />
          { dormitoryCode ? <CustomTable ref={customTable} {...dormitoryTableProps} /> : ''}
        </Fragment>
      }
    </div>
    </div>
  );
};
