import React, { useEffect, useState, useRef,Fragment } from 'react';
import {
  getCampusAttendanceInfo,
  getDormitoryAttendanceInfo,
  exportCampusAttendance,
  exportDormitoryAttendance,
  selectRuleList,
  attendTimeArrangeSelectList,
} from '@/services/attendance';
import AttendanceSetting from './components/attendance-setting-time-modal';
import CustomTable from '@/pages/components/custom-table';
import moment from 'moment';
import styles from './index.less';
import { Link } from 'umi';
import {message} from 'antd';
import { downloadFileByBlob } from '@/utils/common';

export default () => {

  const [campusCensus, setCampusCensus] = useState({});
  const [dormitoryCensus, setDormitoryCensus] = useState({});
  const [tableType, setTableType] = useState('campus');
  const [visible, setVisible] = useState(false);  //考勤时间设置弹框
  const [attendanceSettingActive, setAttendanceSettingActive] = useState(false);
  const [campusAttendTime, setCampusAttendTime] = useState();
  const [dormitoryAttendTime, setDormitoryAttendTime] = useState();
  const [campusRuleId, setCampusRuleId] = useState('');
  const [dormitoryRuleId, setDormitoryRuleId] = useState('');
  const [customPageSize, setCustomPageSize] = useState<number>(10);

  useEffect(() => {
    getCampusAttendanceInfo().then(res => {
      if (res.data) {
        if (res.data.haveRule) {
          setCampusCensus(res.data.dto);
        }
      }
    });

    getDormitoryAttendanceInfo().then(res => {
      if (res.data) {
        if (res.data.haveRule) {
          setDormitoryCensus(res.data.dto);
        }
      }
    });

    selectRuleList({type:0}).then(res1 =>{
      if (res1.data){
        if (res1.data.haveRule){
          setCampusAttendTime(res1.data.ruleList.reverse())
        }
      }
    });

    selectRuleList({type:1}).then(res1 =>{
      if (res1.data){
        if (res1.data.haveRule){
          setDormitoryAttendTime(res1.data.ruleList.reverse())
        }
      }
    });
  }, []);

  useEffect(()=>{
    window.addEventListener('resize', (event)=>{
      const {innerWidth} = event.target;
      const size = innerWidth <= 1024 ? 5 : 10;
      setCustomPageSize(size);
    });
  },[]);

  const customTable = useRef();

  const exportExcl = async () => {
    message.loading('正在生成文件...');
    if (tableType == 'campus'){
      // 导出excel
      const blobContent = await exportCampusAttendance(customTable.current.getData());
      downloadFileByBlob(blobContent, '校园考勤统计表格.xls');
    }else {
      const blobContent = await exportDormitoryAttendance(customTable.current.getData());
      downloadFileByBlob(blobContent, '寝室考勤统计表格.xls');
    }
  };

  const handleVisible = (result: boolean) => {
    setVisible(result);
    setAttendanceSettingActive(result);
  };

  const handleAttendTimeRange = (ruleId:string, type:number) => {
    type == 0 ? setCampusRuleId(ruleId) : setDormitoryRuleId(ruleId);
    customTable.current.search({ruleId,type});
    if (type == 0){
      getCampusAttendanceInfo({ruleId,type}).then(res => {
        if (res.data) {
          if (res.data.haveRule) {
            setCampusCensus(res.data.dto);
          }
        }
      });
    }else {
      getDormitoryAttendanceInfo({ruleId,type}).then(res => {
        if (res.data) {
          if (res.data.haveRule) {
            setDormitoryCensus(res.data.dto);
          }
        }
      });
    }
  };

  const attendanceTimeModalProps = {
    visible,
    handleVisible
  };

  //校区考勤人员列表
  const schoolTableProps = {
    url: '/api/attendance/personInCampusAttendanceList',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      columns: [
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
          render: (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
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
          width: '8%',
          editable: true,
          key: 'code',
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '15%',
          editable: true,
          key: 'ipNum',
        },
        {
          title: '上学考勤时间',
          dataIndex: 'schoolTime',
          width: '15%',
          editable: true,
          key: 'schoolTime',
          render: text => (<div>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</div>)
        },
        {
          title: '放学考勤时间',
          dataIndex: 'homeTime',
          width: '15%',
          editable: true,
          key: 'homeTime',
          render: text => (<div>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</div>)
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              <Link to={"/attendance-management/detail?type=campus&personId=" + record.personId} className={styles.logo} key="logo">
                ···
              </Link>
            </div>
          ),
        },
      ],
    },
  };

  //寝室考勤人员列表
  const dormitoryTableProps = {
    url: '/api/attendance/personInDormitoryAttendanceList',
    pageSize:customPageSize,
    tableFields: {
      rowKey: 'personId',
      columns: [
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
          render: (text) => (<div>{text === 1 ? '男' : '女'}</div>)
        },
        {
          title: '身份证号',
          dataIndex: 'ipNum',
          width: '10%',
          editable: true,
          key: 'ipNum',
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          width: '5%',
          editable: true,
          key: 'roleName',
        },
        {
          title: '班级',
          dataIndex: 'className',
          width: '10%',
          editable: true,
          key: 'className',
        },
        {
          title: '考勤楼栋',
          dataIndex: 'dormitoryName',
          width: '10%',
          editable: true,
          key: 'dormitoryName',
        },
        {
          title: '进入寝室时间',
          dataIndex: 'enterTime',
          width: '10%',
          editable: true,
          key: 'schoolTime',
        },
        {
          title: '离开寝室时间',
          dataIndex: 'leaveTime',
          width: '10%',
          editable: true,
          key: 'homeTime',
        },
        {
          title: '是否为本栋住宿生',
          dataIndex: 'isCorrect',
          width: '10%',
          editable: true,
          key: 'isCorrect',
          render: text => (<div>{text == 0 ? '是' : '否'}</div>)
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              {
                record.isCorrect == 0 ?
                  <Link to={"/attendance-management/detail?type=dormitory&dormitoryCode="+record.dormitoryCode+"&personId="+record.personId}
                        className={styles.logo} key="logo">
                    ···
                  </Link> : ''
              }
            </div>
          ),
        },
      ],
    },
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.attendanceManagement}>

      <div className={styles.top}>
        <div className={styles.button}>
          {
            tableType == 'dormitory'
              ? ''
              :
              attendanceSettingActive
                ?
                <img src={require('@/assets/attendance/setting_attend_active.png')} onClick={()=>{setAttendanceSettingActive(false)}}/>
                :
                <img src={require('@/assets/attendance/setting_attend.png')} onClick={()=>handleVisible(true)}/>
          }
          {
            tableType == 'dormitory'
              ? ''
              :
              <Link to="/attendance-management/schedule" className={styles.goBack}>
                值班安排
              </Link>
          }
          <Link to={"/attendance-management/history-query?type="+tableType} className={styles.goBack}>
            考勤查询
          </Link>
            <div style={{ marginLeft: 10 }} className={styles.goBack} onClick={() => { exportExcl() }}>导出表格</div>
          </div>
          <div className={styles.left}>
            <div className={tableType === 'campus' ? styles.active : styles.normal} onClick={() => setTableType('campus')}>校园<br />考勤</div>
            <div className={tableType === 'dormitory' ? styles.active : styles.normal} onClick={() => setTableType('dormitory')}>寝室<br />考勤</div>
          </div>
          <div className={styles.right}>
            {
              tableType == 'campus'
                ?
                <div className={styles.attendTimeRange}>
                  {
                    (campusAttendTime || []).map((item,index)=>{
                      if (index != 0){
                        return(
                          <Fragment>
                            <div key={index}>|</div>
                            <div className={ (campusRuleId != '' ? item.ruleId == campusRuleId : item.isNow == 0) ? styles.active : ''}
                                 onClick={()=>handleAttendTimeRange(item.ruleId,item.type)}
                                 key={item.ruleId}
                            >
                              {moment(item.startTime).format('HH:mm')}-{moment(item.endTime).format('HH:mm')}
                            </div>
                          </Fragment>
                        )
                      }else {
                        return (
                          <div className={ (campusRuleId != '' ? item.ruleId == campusRuleId : item.isNow == 0) ? styles.active : ''}
                               onClick={()=>handleAttendTimeRange(item.ruleId, item.type)}
                               key={item.ruleId}
                          >
                            {moment(item.startTime).format('HH:mm')}-{moment(item.endTime).format('HH:mm')}
                          </div>
                        )
                      }
                    })
                  }
                </div>
                :
                <div className={styles.attendTimeRange}>
                  {
                    (dormitoryAttendTime || []).map((item,index)=>{
                      if (index != 0){
                        return(
                          <Fragment>
                            <div key={index}>|</div>
                            <div className={ (dormitoryRuleId != '' ? item.ruleId == dormitoryRuleId : item.isNow == 0) ? styles.active : ''}
                                 onClick={()=>handleAttendTimeRange(item.ruleId,item.type)}
                                 key={item.ruleId}>
                              {moment(item.startTime).format('HH:mm')}-{moment(item.endTime).format('HH:mm')}
                            </div>
                          </Fragment>
                        )
                      }else {
                        return (
                          <div className={(dormitoryRuleId != '' ? item.ruleId == dormitoryRuleId : item.isNow == 0) ? styles.active : ''}
                               onClick={()=>handleAttendTimeRange(item.ruleId, item.type)}
                               key={item.ruleId}
                          >
                            {moment(item.startTime).format('HH:mm')}-{moment(item.endTime).format('HH:mm')}
                          </div>
                        )
                      }
                    })
                  }
                </div>
            }
            <div className={styles.title}>
              <div className={styles.text}>{tableType == 'campus' ? '学生进出校园考勤统计' : '进出寝室考勤统计'}</div>
            </div>
            {
              tableType == 'campus'
                ?
                <div className={styles.desSchool}>
                  <div>
                    <div className={styles.allTotal}>总考勤：
                      <span className={styles.searchSpan} style={{ color: 'rgb(56, 220, 255)'}}
                            onClick={()=>{customTable.current.search({})}}>{campusCensus.allTotal || 0}
                      </span>
                      人</div>
                  </div>
                  <div className={styles.center}>
                    <div>
                      已考勤：
                    <span style={{ color: 'rgb(56, 220, 255)' }}>{campusCensus.alreadyAttendanceTotal || 0}</span>人</div>
                    <div className={styles.ratio}>占比：<span style={{ color: 'rgb(56, 220, 255)' }}>{(campusCensus.ratioOfAlreadyAttend * 100) || 0}%</span></div>
                    <div>正常考勤：<span style={{ color: 'rgb(45, 235, 140)' }}>{campusCensus.normalTotal || 0}</span></div>
                    <div className={styles.lastDiv}>
                      <div className={styles.lastLeft}>
                        <div className={styles.late}>迟到：
                          <span className={styles.searchSpan} style={{ color: 'rgb(255, 164, 66)'}}
                                onClick={()=>{customTable.current.search({selectState:1})}}>{campusCensus.lateTotal || 0}
                          </span>
                          人</div>
                        <div className={styles.normal}>早退：
                          <span className={styles.searchSpan} style={{ color: 'rgb(255,0,0)'}}
                                onClick={()=>{customTable.current.search({selectState:2})}}>{campusCensus.leaveTotal || 0}
                          </span>
                          人</div>
                      </div>
                      <div className={styles.lastRight}>漏勤：
                        <span className={styles.searchSpan} style={{ color: 'rgb(243, 2, 230)'}}
                              onClick={()=>{customTable.current.search({selectState:3})}}>{campusCensus.errorTotal || 0}</span>
                        人
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={styles.notAttendance}>未考勤：
                      <span  className={styles.searchSpan}
                            onClick={()=>{customTable.current.search({selectState:4})}}>{campusCensus.notAttendanceTotal || 0}
                      </span>
                      人</div>
                  </div>
                </div>
                :
                <div className={styles.desDormitory}>
                  <div className={styles.count}>总考勤：
                    <span className={styles.searchSpan} style={{ color: 'rgb(56, 220, 255)'}}
                          onClick={()=>{customTable.current.search({})}}>{dormitoryCensus.allTotal || 0}
                    </span>
                    人</div>
                  <div className={styles.delayDiv}>
                    <div>正常考勤：
                      <span style={{ color: 'rgb(45, 235, 140)' }}>{dormitoryCensus.normalAttendanceNum || 0}</span>
                      人</div>
                    <div>
                      <div style={{display:'inline-block',visibility:'hidden'}}>占格</div>
                      漏勤：
                      <span className={styles.searchSpan} style={{ color: 'rgb(243, 2, 230)'}}
                            onClick={()=>{customTable.current.search({selectState:6})}}>{dormitoryCensus.errorTotal || 0}
                      </span>
                      人</div>
                  </div>
                  <div className={styles.delayDiv}>
                    <div>超时未离寝：
                      <span className={styles.searchSpan} style={{ color: 'rgb(255,0,0)'}}
                            onClick={()=>{customTable.current.search({selectState:4})}}>{dormitoryCensus.passTimeNotLeaveNum || 0}
                      </span>
                      人</div>
                    <div>超时未归寝：
                      <span className={styles.searchSpan} style={{ color: 'rgb(255,0,0)'}}
                            onClick={()=>{customTable.current.search({selectState:3})}}>{dormitoryCensus.passTimeNotBackNum || 0}
                      </span>
                      人</div>
                  </div>
                  <div className={styles.delayDiv}>
                    <div>超时已离寝：
                      <span className={styles.searchSpan} style={{ color: 'rgb(255,0,0)'}}
                            onClick={()=>{customTable.current.search({selectState:2})}}>{dormitoryCensus.passTimeBackNum || 0}
                      </span>
                      人</div>
                    <div>超时已归寝：
                      <span className={styles.searchSpan} style={{ color: 'rgb(255,0,0)'}}
                            onClick={()=>{customTable.current.search({selectState:1})}}>{dormitoryCensus.passTimeBackNum || 0}
                      </span>
                      人</div>
                  </div>
                  <div className={styles.count}>非本楼栋人员考勤：
                    <span className={styles.searchSpan} style={{ color: 'rgb(255, 164, 66)'}}
                          onClick={()=>{customTable.current.search({selectState:5})}}>{dormitoryCensus.notThisDormitoryNum || 0}
                    </span>
                    人</div>
                </div>
            }
          </div>
        </div>
        {tableType === 'campus' ? <CustomTable ref={customTable} {...schoolTableProps} /> : ''}
        {tableType === 'dormitory' ? <CustomTable ref={customTable} {...dormitoryTableProps} /> : ''}

      {visible == true ? <AttendanceSetting {...attendanceTimeModalProps}/> : ''}
    </div>
    </div>
  );
};
