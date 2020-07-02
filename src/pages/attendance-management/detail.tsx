import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/pages/components/custom-table';
import {
  exportPersonalCampusAttendance,
  exportPersonalDormitoryAttendance,
  getPersonCampusDetailInfo,
  getPersonDormitoryDetailInfo,
  updateAttendance,
} from '@/services/attendance';
import moment from 'moment';
import styles from './detail.less';
import BaseForm from '@/pages/components/base-form';
import ECharts from '@/pages/components/echart';
import SvgIcon from '@/components/svg/icon';
import { message, Modal } from 'antd';
import { downloadFileByBlob } from '@/utils/common';

export default props => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const {personId,startTime,endTime,type,dormitoryCode} = props.location.query;
  console.log(props.location.query);

  const [attendanceStatistics, setAttendanceStatistics] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [visible, setVisible] = useState(false);
  const [haveRule, setHaveRule] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>();
  const [formList, setFormList] = useState<any>([]);


  useEffect(()=>{
    const params = {personId};
    if (startTime && endTime){
      params.startTime = startTime.format('YYYY-MM-DD') + ' 00:00:00';
      params.endTime = endTime.format('YYYY-MM-DD') + ' 00:00:00';
    }

    if (type == 'campus'){
      getPersonCampusDetailInfo({...params}).then(res=>{
        if (res.data){
          setHaveRule(res.data.haveRule);
          let data = JSON.parse(JSON.stringify(res.data));
          const {personalCensus, personInfo} = data;
          formatPersonInfo(personInfo);
          setAttendanceStatistics(personalCensus || {});
        }
      });
      setFormList(campusFormList);
    }
    else {
      getPersonDormitoryDetailInfo({...params,dormitoryCode:Number(dormitoryCode)}).then(res=>{
        if (res.data){
          setHaveRule(res.data.haveRule);
          let data = JSON.parse(JSON.stringify(res.data));
          const {dormitoryCensus, personInfo} = data;
          formatPersonInfo(personInfo);
          setAttendanceStatistics(dormitoryCensus || {});
        }
      });
      setFormList(dormitoryFormList);
    }


  },[]);

  const customTable = useRef();
  const baseForm = useRef();
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 16 }
    }
  };

  const campusFormList = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'sex', label: '性别', type: 'input', },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'className', label: '所在班级', type: 'input' },
    { name: 'code', label: '学号', type: 'input', },
    { name: 'teacherName', label: '班主任', type: 'input' },
    { name: 'teacherPhone', label: '联系方式', type: 'input' },
    { name: 'parent1', label: '监护人1', type: 'input' },
    { name: 'parentPhone1', label: '手机号', type: 'input' },
    { name: 'dormitoryName', label: '宿舍', type: 'input' },
    { name: 'remark', label: '备注', type: 'input' },
  ];

  const dormitoryFormList = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'sex', label: '性别', type: 'input', },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'className', label: '所在班级', type: 'input' },
    { name: 'code', label: '学号', type: 'input', },
    { name: 'teacherName', label: '班主任', type: 'input' },
    { name: 'teacherPhone', label: '联系方式', type: 'input' },
    { name: 'dormitoryName', label: '宿舍', type: 'input' },
    { name: 'remark', label: '备注', type: 'input',className:'textarea' },
  ];

  const formProps = {
    initialValues,
    hiddenFooter: true,
    formList,
  };

  const formatPersonInfo = (personInfo:object) => {
    let data = {};
    if (personInfo.parent){
      if (personInfo.parent.indexOf(',') > 0){
        const array = personInfo.parent.split(',');
        const parent1 = array[0].split('|');
        const parent2 = array[1].split('|');

        data.parentName1 = parent1[1];
        data.relation1 = parent1[2];
        data.parentPhone1 = parent1[3];

        data.parentName2 = parent2[1];
        data.relation2 = parent2[2];
        data.parentPhone2 = parent2[3];
      }else {
        const parent1 = personInfo.parent.split('|');

        data.parentName1 = parent1[1];
        data.relation1 = parent1[2];
        data.parentPhone1 = parent1[3];
      }

      delete personInfo.parent;
    }
    personInfo.sex == 0 ? personInfo.sex = '女' : personInfo.sex = '男';
    setImgUrl(personInfo.url);
    Object.keys(data).forEach(key=> data[key] ? '' : data[key] = '暂无');
    Object.keys(personInfo).forEach(key=> personInfo[key] ? '' : personInfo[key] = '暂无');
    setInitialValues({data,...personInfo});
  };

  const exportExcl = async () => {
    message.loading('正在生成文件...');
    if (type == 'campus'){
      // 导出excel
      const blobContent = await exportPersonalCampusAttendance(customTable.current.getData());
      downloadFileByBlob(blobContent, '个人校园考勤统计表格.xls');
    }else {
      const blobContent = await exportPersonalDormitoryAttendance(customTable.current.getData());
      downloadFileByBlob(blobContent, '个人寝室考勤统计表格.xls');
    }
  };

  const updatePersonAttendance = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    updateAttendance().then(res=>{
      if (res.data){
        customTable.current.search({});
      }
    });
  };

  //人员详情--校园考勤列表
  const campusTableProps = {
    url: '/api/attendance/personCampusDetailInfo',
    pageSize:8,
    params:{
      personId
    },
    tableFields: {
      rowKey: 'studentId',
      columns: [
        {
          title: '日期',
          dataIndex: 'date',
          width: '15%',
          editable: true,
          key: 'date',
          render: (text,record) => (<div>{record.schoolTime ? moment(record.schoolTime).format('YYYY-MM-DD') : ''}</div>)
        },
        {
          title: '上学考勤时间',
          dataIndex: 'schoolTime',
          width: '15%',
          editable: true,
          key: 'schoolTime',
          render: text => (<div>{text ? moment(text).format('HH:mm:ss') : ''}</div>)
        },
        {
          title: '放学考勤时间',
          dataIndex: 'homeTime',
          width: '15%',
          editable: true,
          key: 'homeTime',
          render: text => (<div>{text ? moment(text).format('HH:mm:ss') : ''}</div>)
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '15%',
          editable: true,
          key: 'status',
          render : (text) => (<div style={text === 1 ? {} : {color:'red'}}>{text === 1 ? '正常' : '异常'}</div>)
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
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
                    onClick={() => {record.status == 0 ? setVisible(true) : ''}}
                  />
                  : ''
              }
            </div>
          ),
        },
      ],
    },
  };

  //人员详情--寝室考勤列表
  const dormitoryTableProps = {
    url: '/api/attendance/personDormitoryDetailInfo',
    pageSize:8,
    params:{
      personId,
      dormitoryCode
    },
    tableFields: {
      rowKey: 'studentId',
      columns: [
        {
          title: '日期',
          dataIndex: 'date',
          width: '15%',
          editable: true,
          key: 'date',
          render: (text,record) => (<div>{moment(record.enterTime).format('YYYY-MM-DD')}</div>)
        },
        {
          title: '进入寝室时间',
          dataIndex: 'enterTime',
          width: '15%',
          editable: true,
          key: 'enterTime',
          render: text => (<div>{moment(text).format('HH:mm:ss')}</div>)
        },
        {
          title: '离开寝室时间',
          dataIndex: 'leaveTime',
          width: '15%',
          editable: true,
          key: 'leaveTime',
          render: text => (<div>{moment(text).format('HH:mm:ss')}</div>)
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '15%',
          editable: true,
          key: 'status',
          render : (text) => (<div style={text === 1 ? {} : {color:'red'}}>{text === 1 ? '正常' : '异常'}</div>)
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
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
                    onClick={() => {record.status == 0 ? setVisible(true) : ''}}
                  />
                  : ''
              }
            </div>
          ),
        },
      ],
    },
  };

  //考勤分析
  const attendanceOptions = {
    series: [
      {
        silent:true,
        name: '已考勤',
        type: 'pie',
        radius: ['53%', '62%'],
        zlevel:2,
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: 1 - attendanceStatistics.rateOfAttendance || 0,
            name: '未考勤',
            itemStyle:{
              color:'red',
              opacity:0,
            },
            label: {
              show:false,
            }
          },
          {
            value: attendanceStatistics.rateOfAttendance || 0,
            name: '出勤率',
            label: {
              show: true,
              position: 'center',
              color: '#63f9fe',
              fontSize: 18,
              formatter:'{d}%',
            },
            itemStyle:{
              color: 'rgb(52, 202, 235)'
            },
          },
        ],
        startAngle:90,
      },
      {
        silent:true,
        name: '黑环',
        type: 'pie',
        radius: ['55%', '60%'],
        zlevel:1,
        avoidLabelOverlap: false,
        labelLine: { show: false },
        label:{show:false},
        data: [
          {value: 24, name: '黑环',
            itemStyle:{color:'rgb(40, 73, 117)'}},
        ],
        startAngle:3.6,
        selectedOffset:16,
      },
      {
        silent:true,
        name: '外环',
        type: 'pie',
        radius: ['69%', '69%'],
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        data: [
          {
            value: 0,
            name: '出勤率',
            itemStyle:{
              borderColor:'#00fff36b',
              borderType:'dashed',
              borderWidth: 1,
            },
            label:{
              color: '#63f9fe',
              fontSize: 12,
              padding:[42,0,0,0],
            }
          },
        ],
      }
    ]
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.attendanceDetail}>
      <div className={styles.top}>
        <div className={styles.info}>
          <div className={styles.title}>个人信息</div>
          <div className={styles.content}>
            <div className={styles.img}>
              <img src={imgUrl} alt='***'/>
            </div>
            <BaseForm
              ref={baseForm}
              {...formProps}
              formItemLayout={formItemLayout}
            />
          </div>
        </div>
        <div className={styles.analyze}>
          <div className={styles.button}>
            <div style={{marginRight:10}} className={styles.goBack} onClick={ () => {exportExcl()}}>导出表格</div>
            <div className={styles.goBack} onClick={ () => {history.back()}}>返回</div>
          </div>
          <div className={styles.title}>考勤统计分析</div>
          <div className={styles.content}>
            {
              haveRule == true ?
                type == 'campus'
                  ?
                  <div className={styles.des}>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <div className={styles.text}>总考勤天数:</div>
                      <div className={styles.day}><span className={styles.blueColor}>{attendanceStatistics.allDayNum || 0}</span>天</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>实际考勤天数:</div>
                      <div className={styles.day}><span className={styles.greenColor}>{attendanceStatistics.actualDayNum || 0}</span>天</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>未考勤天数:</div>
                      <div className={styles.day}><span className={styles.blueColor}>{attendanceStatistics.notAttendNum || 0}</span>天</div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <div className={styles.text}>总考勤次数:</div>
                      <div className={styles.day}><span className={styles.greenColor}>{attendanceStatistics.allAttendanceCount || 0}</span>次</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>迟到次数:</div>
                      <div className={styles.day}><span className={styles.brownColor}>{attendanceStatistics.lateAttendanceCount || 0}</span>次</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>早退次数:</div>
                      <div className={styles.day}><span className={styles.redColor}>{attendanceStatistics.leaveAttendanceCount || 0}</span>次</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>漏勤次数:</div>
                      <div className={styles.day}><span className={styles.pinkColor}>{attendanceStatistics.errorCount || 0}</span>次</div>
                    </div>
                  </div>
                </div>
                  :
                  <div className={styles.des}>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <div className={styles.text}>总考勤天数:</div>
                      <div className={styles.day}><span className={styles.blueColor}>{attendanceStatistics.allDayNum || 0}</span>天</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>总考勤次数:</div>
                      <div className={styles.day}><span className={styles.greenColor}>{attendanceStatistics.allAttendNum || 0}</span>天</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>正常考勤次数:</div>
                      <div className={styles.day}><span className={styles.greenColor}>{attendanceStatistics.normalAttendNum || 0}</span>天</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>漏勤次数:</div>
                      <div className={styles.day}><span className={styles.redColor}>{attendanceStatistics.errorCount || 0}</span>次</div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <div className={styles.text}>超时已归寝:</div>
                      <div className={styles.day}><span className={styles.redColor}>{attendanceStatistics.passTimeBack || 0}</span>次</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>超时已离寝:</div>
                      <div className={styles.day}><span className={styles.redColor}>{attendanceStatistics.passTimeLeave || 0}</span>次</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>超时未归寝:</div>
                      <div className={styles.day}><span className={styles.redColor}>{attendanceStatistics.passTimeNotBack || 0}</span>次</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.text}>超时未离寝:</div>
                      <div className={styles.day}><span className={styles.redColor}>{attendanceStatistics.passTimeNotLeave || 0}</span>次</div>
                    </div>
                  </div>
                </div>
                : <div>暂无考勤信息</div>
            }
            <div className={styles.graph}>
              {haveRule == true ? <ECharts option={attendanceOptions} /> : ''}
            </div>
          </div>
        </div>
      </div>
      {
        type == 'campus'
          ?
          <CustomTable ref={customTable} {...campusTableProps} />
          :
          <CustomTable ref={customTable} {...dormitoryTableProps} />
      }


      <Modal
        className={styles.infoModal}
        title="考勤详情"
        cancelText="关闭"
        okText="确认"
        onCancel={() => setVisible(false)}
        onOk={updatePersonAttendance}
        visible={visible}
        closable={false}
      >
        <p style={{fontSize:24,margin:0,color:'rgb(193, 42, 42)'}}>是否修改该人员状态?</p>
      </Modal>
    </div>
    </div>
  );
};
