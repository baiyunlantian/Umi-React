import React, { useState, useEffect, useRef } from 'react';
import {
  getAttendDateArrangeList,
  updateAttendDateArrangeList,
  attendTimeArrangeChange,
  attendTimeArrangeSelectList
} from '@/services/attendance';
import { message, Modal } from 'antd';
import moment from 'moment'
import BaseForm from '@/pages/components/base-form';
import styles from '../index.less';
import SvgIcon from '@/components/svg/icon';

export default ({handleVisible,visible}) => {

  useEffect(()=>{
      const initial = {};
      attendTimeArrangeSelectList().then(res=>{
        if (res.data){
          if (res.data.list && res.data.list.length > 0){
            const {list} = res.data;
            const classTimes: any[] = [];
            const restTimes: any[] = [];

            list.forEach((item: { type: number; })=>{
              item.type == 0 ? classTimes.push(item) : restTimes.push(item);
            });

            //上课时间
            classTimes.forEach((item,index)=>{
              const formatTime = [moment(item.startTime,'HH:mm'),moment(item.endTime,'HH:mm')];
              if (index == 0){
                initial.classTime1 = formatTime;
              }else if (index == 1){
                initial.classTime2 = formatTime;
              }else if (index == 2){
                initial.classTime3 = formatTime;
              }
            });

            //休息时间
            restTimes.forEach((item,index)=>{
              const formatTime = [moment(item.startTime,'HH:mm'),moment(item.endTime,'HH:mm')];
              if (item.endTime == '23:59:59'){
                initial.rest3 = moment(item.startTime,'HH:mm');
              }else if (index == 0){
                initial.rest1 = formatTime;
              }else if (index == 1){
                initial.rest2 = formatTime;
              }
            });

          }
        }
        const visible = editAttendTime;
        setEditAttendTime(visible);
        setAttendTimeInit(initial);
        baseForm.current && baseForm.current.setFieldsValue(initial);
      });

      //获取当前年份、月份
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let monthRange: any[];
      if (month < 3){
        monthRange = [1,2,3,4];
      }else if (month > 9){
        monthRange = [9,10,11,12];
      }else {
        monthRange = [month-1,month,month+1,month+2];
      }

      getAttendDateArrangeListFn(year, monthRange);

    },
    []);

  const campus = JSON.parse(window.localStorage.getItem('campus'));

  const baseForm = useRef();

  const [baseClassTimes, setBaseClassTimes] = useState<any>([]);
  const [selectTimes, setSelectTimes] = useState<any>([]);       //记录更改的考勤日期
  const [classTimeList, setClassTimeList] = useState<any>([]);   //上课(未上)时间--控制样式切换
  const [settingScheduleYear, setSettingScheduleYear] = useState<number>();
  const [settingMonthRange, setSettingMonthRange] = useState<any>([]);
  const [monthList, setMonthList] = useState([]);   //渲染数据
  const [editClassTime, setEditClassTime] = useState(false);
  const [editAttendTime, setEditAttendTime] = useState(false);
  const [attendTimeInit, setAttendTimeInit] = useState({});

  useEffect(()=>{
    const visible = editAttendTime;
    setEditAttendTime(visible);
    setAttendTimeInit(attendTimeInit);
    baseForm.current && baseForm.current.setFieldsValue(attendTimeInit);
  },[attendTimeInit]);

  const week = ['一','二','三','四','五','六','日'];

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
    formList: [
      { name: 'classTime1', label: '上课时间', type: 'time-range' },
      { name: 'rest1', label: '休息时间', type: 'time-range', },
      { name: 'classTime2', label: '上课时间', type: 'time-range' },
      { name: 'rest2', label: '休息时间', type: 'time-range' },
      { name: 'classTime3', label: '上课时间', type: 'time-range' },
      { name: 'rest3', label: '休息时间', type: 'time-picker', },
    ],
  };

  //选择日期
  const selectDate =  (date:string) => {
    let selectTime = JSON.parse(JSON.stringify(selectTimes));     //记录选择时间
    let classTimes = JSON.parse(JSON.stringify(classTimeList));   //控制样式切换

    selectTime.includes(date) ? selectTime.splice(selectTime.indexOf(date),1) : selectTime.push(date);
    classTimes.includes(date) ? classTimes.splice(classTimes.indexOf(date),1) : classTimes.push(date);

    setSelectTimes(selectTime);
    setClassTimeList(classTimes);
  };


  const handleUpdateClassTime = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    console.log('选择',selectTimes);
    if (selectTimes.length > 0){
      updateAttendDateArrangeList({dayList:selectTimes}).then(res=>{
        if (res.data){
          message.success('修改成功');
          handleVisible(false);
          setEditClassTime(false);
          setSelectTimes([]);
          setClassTimeList([]);
        }
      });
    }
  };

  const handleUpdateAttendTime = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = baseForm.current.getFieldsValue();
    const timeList = [];

    Object.keys(values).forEach(key=>{
      if (values[key] != undefined){
        if (key == 'rest3'){
          timeList.push({startTime:values[key].format('HH:mm:ss'),type:1});
        }else {
          const startTime = values[key][0];
          const endTime = values[key][1];
          const type = key.indexOf('classTime') >= 0 ? 0 : 1;

          timeList.push({startTime:startTime.format('HH:mm:ss'),endTime:endTime.format('HH:mm:ss'),type});
        }
      }
    });

    if (timeList.length > 0){
      attendTimeArrangeChange({timeList}).then(res=>{
        if (res.data){
          message.success('修改成功');
          setEditAttendTime(false);
        }
      });
    }
  };

  //渲染每一天
  const renderCalendarCell = (month: string, data: object, endDate: number) => {
    //value 格式 : YYYY-MM-DD

    const dateObject = new Date(settingScheduleYear + '-' + month + '-' + data.dayNum);
    const day = dateObject.getDay();  //星期几
    let element = [];
    let spanElement;

    if (data.feature == 0) {
      spanElement = <span key={month + '-' + data.dayNum} className='dateState0'>{data.dayNum}</span>;
    } else {
      spanElement = <span key={month + '-' + data.dayNum}
        className={classTimeList.includes(settingScheduleYear + '-' + month + '-' + data.dayNum) ? 'dateState1' : 'dateState2'}
        onClick={
          editClassTime == true
          ? ()=>selectDate(settingScheduleYear + '-' + month + '-' + data.dayNum)
          : ()=>console.log(settingScheduleYear + '-' + month + '-' + data.dayNum)
        }
      >{data.dayNum}</span>;
    }


    //当月第一天
    if (data.dayNum == 1) {
      element = completeBlankCellCount('start', day);
      element.push(spanElement);
    }
    //当月最后一天
    else if (data.dayNum == endDate) {
      element = completeBlankCellCount('end', day);
      element.unshift(spanElement);
    } else {
      element.push(spanElement);
    }

    return element;
  };

  //渲染每个月
  const renderCalendarList = (month: object) => {
    const monthLength = new Date(settingScheduleYear,month.month,0).getDate();  //该月天数
    const setTimeList: string[] = [];   //已设置的时间
    let spanElementList: any[] = [];

    if (month.list && month.list.length > 0){
      month.list.forEach(item=>{setTimeList.push(item.dayNum);});
    }

    for(let i = 1; i <= monthLength; i++){
      if (i < 10){
        i = '0'+i;
      }
      if (setTimeList.indexOf(String(i)) >= 0){
        const el = renderCalendarCell(month.month, month.list[setTimeList.indexOf(String(i))], monthLength);
        spanElementList.push(el);
      }else {
        const el = renderCalendarCell(month.month, {dayNum:i,feature:2}, monthLength);
        spanElementList.push(el);
      }
    }

    return spanElementList;
  };

  //计算渲染空白格的数量
  const completeBlankCellCount = (type:string,dateParam:number) => {
    let day = dateParam == 0 ? 7 : dateParam ;    //星期几
    let count = 0;
    let elementArray = [];
    if (type == 'start'){
      count =  day - 1;
    }else if (type == 'end'){
      count =  7 - day;
    }

    for (let i=0; i<count; i++){
      elementArray.push(<span key={i}></span>)
    }

    return elementArray;
  };

  //获取上课时间日历表
  const getAttendDateArrangeListFn = (year: number | undefined, monthRangeList: object) => {
    let cList: any[] = [];
    setSelectTimes([]);

    getAttendDateArrangeList({year,list:monthRangeList}).then(res=>{
      if (res.data){
        const monthList = res.data.list;
        setMonthList(monthList);

        if (monthList && monthList.length > 0){
          monthList.forEach((item: { list: any; month: any; })=>{
            const {list,month} = item;

            if (list && list.length > 0){
              list.forEach((day: { feature: any; dayNum: any; })=>{
                const {feature,dayNum} = day;

                if (feature == 1){
                  cList.push(year + '-' + month + '-' + dayNum);
                }
              });
            }
          });
        }
      }
      setSettingScheduleYear(year);
      setSettingMonthRange(monthRangeList);
      setClassTimeList(cList);
      setBaseClassTimes(cList);
    });
  };

  return(
    <Modal
      title='考勤时间设置'
      className={styles.attendanceSettingModal}
      visible={visible}
      onCancel={()=>{
        handleVisible(false);
        setClassTimeList(baseClassTimes);
        setSelectTimes([]);
        setEditClassTime(false);
        setEditAttendTime(false);
      }}
      closable={true}
    >
      <div className={styles.classScheduleContainer}>
        <div className={styles.title}>
          <div className={styles.text}>上课时间安排表</div>
          {
            editClassTime == false
              ?
              <SvgIcon
                name='update'
                width={25}
                height={25}
                color="rgb(55, 217, 252)"
                onClick={() => {setEditClassTime(true)}}
              />
              : ''
          }
        </div>
        <div className={styles.calendarList}>
          {
            settingMonthRange.includes(1) == true
              ?
              ''
              :
              <SvgIcon
                name='arrowLeft'
                width={25}
                height={25}
                color="rgb(178, 180, 181)"
                onClick={()=>getAttendDateArrangeListFn(settingScheduleYear, settingMonthRange.map((item: number)=>item - 1))}
              />
          }

          {
            monthList.map((item,index)=>{
              return(
                <div className={styles.calendarItem} key={index}>
                  <div className={styles.tableTile}>
                    {settingScheduleYear}-{item.month}
                  </div>
                  <div className={styles.thead}>
                    {
                      week.map(item2=><span key={item2}>{item2}</span>)
                    }
                  </div>
                  <div className={styles.tbody}>
                    {renderCalendarList(item)}
                  </div>
                </div>
              )
            })
          }
          {
            settingMonthRange.includes(12) == true
              ? ''
              :
              <SvgIcon
                name='arrowRight'
                width={25}
                height={25}
                color="rgb(178, 180, 181)"
                onClick={()=>getAttendDateArrangeListFn(settingScheduleYear, settingMonthRange.map((item: number)=>item + 1))}
              />
          }
        </div>
        <div className={styles.legend}>
          <div
            style={{cursor:'pointer'}}
            onClick={()=>getAttendDateArrangeListFn(settingScheduleYear - 1 , settingMonthRange)}
          >
            &lt;&lt;上一年
          </div>
          <div>
            <span>上课(已上)</span>
            <span>上课(未上)</span>
            <span>放假</span>
          </div>
          <div
            style={{cursor:'pointer'}}
            onClick={()=>getAttendDateArrangeListFn(settingScheduleYear + 1 , settingMonthRange)}
          >
            下一年&gt;&gt;
          </div>
        </div>
        {
          editClassTime == true
            ?
            <div className={styles.footer}>
              <div className={styles.defaultStyleBtn} onClick={handleUpdateClassTime}>修改</div>
              <div
                className={styles.defaultCancelBtn}
                onClick={()=>{
                  setEditClassTime(false);
                  setClassTimeList(baseClassTimes);
                  setSelectTimes([]);
                }}
              >
                取消
              </div>
            </div>
            : ''
        }
      </div>
      <div className={styles.attendanceSettingContainer}>
        <div className={styles.title}>
          <div className={styles.text}>考勤时间设置</div>
          {
            editAttendTime == false
              ?
              <SvgIcon
                name='update'
                width={25}
                height={25}
                color="rgb(55, 217, 252)"
                onClick={() => {
                  setEditAttendTime(true);
                }}
              />
              : ''
          }
        </div>
        <div className={editAttendTime ? styles.maskHidden : styles.maskVisible}></div>
        <BaseForm
          ref={baseForm}
          {...formProps}
          formItemLayout={formItemLayout}
        />
        {
          editAttendTime == true
            ?
            <div className={styles.footer}>
              <div className={styles.defaultStyleBtn} onClick={handleUpdateAttendTime}>修改</div>
              <div
                className={styles.defaultCancelBtn}
                onClick={()=>{
                  setEditAttendTime(false);
                }}
              >
                取消
              </div>
            </div>
            : ''
        }
      </div>
    </Modal>
  )
};
