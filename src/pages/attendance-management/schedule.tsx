import React, { useEffect, useRef, useState } from 'react';
import {Modal, message, Form, Select} from 'antd';
import CalendarItem from './components/calendar-item';
import SvgIcon from '@/components/svg/icon';
import BaseForm from '@/pages/components/base-form';
import {
  dutyDateBatchChange,
  dutyDateList,
  dutyDateDeleteById,
  dutyDateUpdateById,
  addDormitory,
  deleteDormitory,
  updateDormitory,
  getDormitoryList
} from '@/services/attendance';

import {selectPersonFuzzyDownList} from '@/services/person';

import styles from './schedule.less';

export default () => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));

  const [currentDayId, setCurrentDayId] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [fromDisabled, setFromDisabled] = useState(true);
  const [addScheduleActive, setAddScheduleActive] = useState(false);
  const [buildingManageActive, setBuildingManageActive] = useState(false);
  const [currentBuildingId, setCurrentBuildingId] = useState(0);
  const [buildingFormInitial, setBuildingFormInitial] = useState({});
  const [monthList, setMonthList] = useState<any>([]);
  const [settingScheduleYear, setSettingScheduleYear] = useState<number>();
  const [settingMonthRange, setSettingMonthRange] = useState<any>([]);
  const [dormitoryList, setDormitoryList] = useState<any>([]);
  const [teachers, setTeachers] = useState<any>([]);
  const [leaders, setLeaders] = useState<any>([]);
  const [workerList, setWorkerList] = useState<any>([]);
  const [teacherList, setTeacherList] = useState<any>([]);
  const [leaderList, setLeaderList] = useState<any>([]);

  useEffect(()=>{
    //获取当前年份、月份
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let monthRange: any[];
    if (month <= 4){
      monthRange = [1,2,3,4,5,6,7];
    }else if (month >= 9){
      monthRange = [6,7,8,9,10,11,12];
    }else {
      monthRange = [month-3,month-2,month-1,month,month+1,month+2,month+3];
    }

    getDutyDateListFn(year, monthRange);

    getDormitoryList().then(res=>{
      const list: any[] = [];
      const selectListOption: any[] = [];
      if (res.data && res.data.length > 0){
        res.data.forEach((item,index:number)=>{
          Object.keys(item).forEach(key => item[key] == null ? item[key] = '' : '');
          if (index == 0){
            setBuildingFormInitial(item);
            setCurrentBuildingId(item.id);
          }
          list.push(item);
        });
      }
      setDormitoryList(list);
    });

    //宿管员
    selectPersonFuzzyDownList({roleId:3}).then(res=>{
      if (res.data){
        const list: any[] = [];
        res.data.map(item=>{
          const {personId:key, name:label,phone} = item;
          list.push({key,label,phone});
        });
        setWorkerList(list);
      }
    });

    //值班老师
    selectPersonFuzzyDownList({roleId:201}).then(res=>{
      if (res.data && res.data.length > 0){
        const list: any[] = [];
        res.data.map(item=>{
          const {personId:key, name:label} = item;
          list.push({key,label});
        });
        setTeacherList(list);
      }
    });

    //值班领导
    selectPersonFuzzyDownList({roleId:6}).then(res=>{
      if (res.data && res.data.length > 0){
        const list: any[] = [];
        res.data.map(item=>{
          const {personId:key, name:label} = item;
          list.push({key,label});
        });
        setLeaderList(list);
      }
    });
  },[]);

  const scheduleForm = useRef();
  const buildingForm = useRef();
  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 16 }
    }
  };
  const scheduleFormItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 32 }
    }
  };
  const BuildingFormItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 16 }
    }
  };

  const selectWorker = (value:any) => {
    // console.log(value);
    const workerId = value;
    let phone = '';
    workerList.map(item=>{
      item.key == workerId ? phone = item.phone : '';
    });
    const buildingInitial = {...buildingFormInitial};
    buildingInitial.phone = phone;
    buildingInitial.workerId = value;
    setBuildingFormInitial(buildingInitial);
  };

  const scheduleFormProps = {
    hiddenFooter: true,
    formList:[
      {
        name:'createTime',
        label: '日期',
        type:'range-picker',
      },
      {
        name:'teacherIds',
        label:'值班老师',
        type:'select',
        mode:'multiple',
        options:teacherList,
        filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
        showSearch:true,
      },
      {
        name:'leaderIds',
        label:'值班领导',
        type:'select',
        mode:'multiple',
        options:leaderList,
        filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
        showSearch:true,
      },
    ],
  };
  const buildingFormProps = {
    hiddenFooter: true,
    initialValues:buildingFormInitial,
    formList:[
      { name:'name', label:'名称', type:'input', },
      { name:'workerId', label:'宿管员', type:'select',
        options:workerList,
        filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
        showSearch:true,
        onSelect:selectWorker
      },
      { name:'code', label:'代号', type:'input', },
      { name:'phone', label:'电话', type:'input',disabled:true },
    ],
  };

  //获取值班时间日历表
  const getDutyDateListFn = (year: number | undefined, monthRangeList: object) => {
    dutyDateList({year,list:monthRangeList}).then(res=>{
      if (res.data){
        const monthList = res.data.list;
        setMonthList(monthList);
      }
    });

    setSettingScheduleYear(year);
    setSettingMonthRange(monthRangeList);
  };

  //选择日期
  const selectDate =  (dayId:number, date:string, month:string) => {
    setCurrentDayId(dayId);
    setCurrentDate(date);
    setFromDisabled(true);

    if (dayId == null){
      setTeachers([]);
      setLeaders([]);
    }else {
      monthList.map(item=>{
        if (item.month == month){
          item.list.map(day=>{
            if (day.dayId == dayId){
              setTeachers(day.teachers.split(','));
              setLeaders(day.leaders.split(','));
            }
          });
        }
      });
    }
  };

  const handleUpdateDutyDate = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    let cTeacherIds: any[] = [];
    let cLeaderIds: any[] = [];
    let cTeachers: any[] = [];
    let cLeaders: any[] = [];

    if (teachers && teachers.length > 0){
      teacherList.forEach(item=>{
        if (teachers.includes(item.label) || teachers.includes(item.key)){
          cTeacherIds.includes(item.key) ? '' : cTeacherIds.push(item.key);
          cTeachers.includes(item.label) ? '' : cTeachers.push(item.label);
        }
      });
    }

    if (leaders && leaders.length > 0){
      leaderList.forEach(item=>{
        if (leaders.includes(item.label) || leaders.includes(item.key)){
          cLeaderIds.includes(item.key) ? '' : cLeaderIds.push(item.key);
          cLeaders.includes(item.label) ? '' : cLeaders.push(item.label);
        }
      });
    }

    if (!(cTeachers.length > 0 && cLeaders.length > 0)){
      message.error('值班老师、领导必选',2);
      return;
    }

    const data: any = {
      teacherIds:cTeacherIds.join(),
      leaderIds:cLeaderIds.join(),
      teachers:cTeachers.join(),
      leaders:cLeaders.join(),
    };
    currentDayId != null ? data.dayId = currentDayId : '';
    console.log(data);

    dutyDateUpdateById(data).then(res=>{
      if (res.data){
        setTeachers(cTeachers);
        setLeaders(cLeaders);
        message.success('修改成功',2);
        setFromDisabled(true);
      }
    });
  };

  const handleDeleteDutyDate = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    dutyDateDeleteById({dayId:currentDayId}).then(res=>{
      if (res.data){
        message.success('删除成功',2);
        dutyDateList({year:settingScheduleYear,list:settingMonthRange}).then(res=>{
          if (res.data){
            const monthList = res.data.list;
            setMonthList(monthList);
          }
        });
      }
    });
  };

  const changeCurrentBuilding = (id:number) => {
    setCurrentBuildingId(id);
    let data = {};

    dormitoryList.forEach(item=>{
      if (item.id == id){
        data = item;
      }
    });

    console.log(data);
    setBuildingFormInitial(data);
    setTimeout(()=>{buildingForm.current.resetFields()},10);
  };

  const handleUpdateDormitory = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = buildingForm.current.getFieldsValue();
    console.log('buildingForm',values);
    if (!(values.name)){
      message.error('宿舍名称不能为空');
      return;
    }
    if (!(values.workerId)){
      message.error('宿管员不能为空');
      return;
    }
    if (!(values.code && Number(values.code))){
      message.error('代码须为数字且不能为空');
      return;
    }
    values.code = Number(values.code);
    if (currentBuildingId == 0){
      addDormitory(values).then(res=>{
        if (res.data){
          getDormitoryList().then(res=>{
            setDormitoryList(res.data);
          });
          message.success('新增成功');
        }else {
          message.error('新增失败');
        }
      });
    }else {
      updateDormitory({id:currentBuildingId,...values}).then(res=>{
        if (res.data){
          const list = dormitoryList.map(item=>{
            if (item.id == currentBuildingId){
              item = {...values};
            }
            return item;
          });
          setDormitoryList(list);
          message.success('修改成功');
        }else {
          message.error('修改失败');
        }
      });
    }
  };

  const handleDeleteDormitory = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    deleteDormitory({id:currentBuildingId}).then(res=>{
      if (res.data){
        const list = dormitoryList.filter(item=>item.id != currentBuildingId);
        setDormitoryList(list);
      }
    });
  };

  const onOk = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = scheduleForm.current.getFieldsValue();
    if (values.createTime && values.createTime.length > 0){
      values.startTime = values.createTime[0].format('YYYY-MM-DD');
      values.endTime = values.createTime[1].format('YYYY-MM-DD');
      delete values.createTime;
    }else {
      message.error('请选择时间');
      return;
    }

    const cTeachers: any[]= [];
    const cLeaders: any[]= [];

    if (values.teacherIds && values.teacherIds.length > 0){
      teacherList.map(item=>{
        if (values.teacherIds.includes(item.key.toString())){
          cTeachers.includes(item.label) ? '' : cTeachers.push(item.label);
        }
      });
    }

    if (values.leaderIds && values.leaderIds.length > 0){
      leaderList.forEach(item=>{
        if (values.leaderIds.includes(item.key.toString())){
          cLeaders.includes(item.label) ? '' : cLeaders.push(item.label);
        }
      });
    }

    if (!(cTeachers.length > 0 && cLeaders.length > 0)){
      message.error('值班老师、领导必选',2);
      return;
    }

    const data: any = {
      teacherIds:values.teacherIds.join(),
      leaderIds:values.leaderIds.join(),
      teachers:cTeachers.join(),
      leaders:cLeaders.join(),
      startTime:values.startTime,
      endTime:values.endTime
    };
    console.log(data);

    dutyDateBatchChange(data).then(res=>{
      if (res.data){
        setTeachers([]);
        setLeaders([]);
        getDutyDateListFn(settingScheduleYear, settingMonthRange);
        message.success('新增成功',2);
        onCancel();
      }
    });
  };

  const onCancel = () => {
    setAddScheduleActive(false);
    setVisible(false);
    scheduleForm.current.resetFields();
  };

  const calendarProps = {
    currentDate,
    settingScheduleYear,
    onChange:selectDate
  };

  return(
    <div className='custom-main-content'>
      <div className={styles.schedulePage}>
        <div className={styles.goBack} onClick={ () => {history.back()}}>返回</div>
        <div className={styles.scheduleContainer}>
        <div className={styles.title}>
          <div className={styles.text}>值班安排表</div>
          <div className={styles.operationDiv}>
            {addScheduleActive
              ?
              <img src={require('@/assets/attendance/add_schedule_active.png')} onClick={()=>{setAddScheduleActive(false)}}/>
              :
              <img src={require('@/assets/attendance/add_schedule.png')} onClick={()=>{setAddScheduleActive(true);setVisible(true)}}/>
            }
            {buildingManageActive
              ?
              <img src={require('@/assets/attendance/manage_building_active.png')} onClick={()=>setBuildingManageActive(false)}/>
              :
              <img src={require('@/assets/attendance/manage_building.png')} onClick={()=>setBuildingManageActive(true)}/>
            }
          </div>
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
                onClick={() => {getDutyDateListFn(settingScheduleYear, settingMonthRange.map((item: number)=>item - 1))}}
              />
          }
          {
            monthList.map((item,index)=>{
              return(
                <CalendarItem {...calendarProps} {...item} key={index}/>
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
                onClick={() => {getDutyDateListFn(settingScheduleYear, settingMonthRange.map((item: number)=>item + 1))}}
              />
          }
        </div>
        <div className={styles.legend}>
          <div
            style={{cursor:'pointer'}}
            onClick={() => {getDutyDateListFn(settingScheduleYear - 1 , settingMonthRange)}}>
            &lt;&lt;上一年
          </div>
          <div>
            <span>已完成</span>
            <span>已安排</span>
            <span>未安排</span>
            <span>当前</span>
          </div>
          <div
            style={{cursor:'pointer'}}
            onClick={() => {getDutyDateListFn(settingScheduleYear + 1, settingMonthRange)}}
          >
            下一年&gt;&gt;
          </div>
        </div>
      </div>
        <div className={styles.personInfoContainer}>
        <div className={styles.title}>
          <div className={styles.text}>值班人员信息</div>
          {
            currentDayId == null
              ? ''
              :
              fromDisabled == true
                ?
                <div className={styles.operationDiv}>
                  <SvgIcon
                    tipTitle='编辑'
                    name='update'
                    width={25}
                    height={25}
                    color="rgb(56, 220, 255)"
                    onClick={() => setFromDisabled(false)}
                  />
                  <SvgIcon
                    tipTitle='删除'
                    name='delete'
                    width={25}
                    height={25}
                    color="rgb(56, 220, 255)"
                    onClick={() => handleDeleteDutyDate()}
                  />
                </div>
                :
                <div className={styles.operationDiv}>
                  <span onClick={() => handleUpdateDutyDate()}>&#9745;</span>
                  <span onClick={() => setFromDisabled(true)}>&#9746;</span>
                </div>
          }
        </div>
        <div className={styles.customForm}>
          <div className={styles.dateController}>
            <span>日期</span>
            <span className={styles.dateInput}>{currentDate}</span>
          </div>
          <div>
            <Form {...formItemLayout}>
              <Form.Item label="值班老师">
                <Select
                  mode="multiple"
                  placeholder="暂未安排值班老师"
                  onChange={(value,option)=>{
                    setTeachers(value);
                  }}
                  value={teachers}
                  disabled={fromDisabled}
                  filterOption={(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false}}
                  showSearch={true}
                >
                  {
                    teacherList.map((item, index) => (
                      <Select.Option key={index} value={item.key}>{item.label}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="值班领导">
                <Select
                  mode="multiple"
                  placeholder="暂未安排值班领导"
                  onChange={(value,option)=>{
                    setLeaders(value);
                  }}
                  value={leaders}
                  disabled={fromDisabled}
                  filterOption={(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false}}
                  showSearch={true}
                >
                  {
                    leaderList.map((item, index) => (
                      <Select.Option key={index} value={item.key}>{item.label}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
        {
          buildingManageActive
            ?
            <div className={styles.dormitoryContainer}>
              <div className={styles.title}>
                <div className={styles.text}>学生寝室楼栋管理</div>
              </div>
              <div className={styles.buildingList}>
                {
                  dormitoryList.map(item=>{
                    return(
                      <div className={styles.buildingItem} key={item.id} onClick={()=>{changeCurrentBuilding(item.id)}}>
                        <img src={currentBuildingId == item.id
                          ? require('@/assets/attendance/building_active.png')
                          : require('@/assets/attendance/building.png')}
                        />
                        <span style={currentBuildingId == item.id ? {color:'rgb(99, 250, 254)'} : {color:'rgb(193, 193, 194)'}}>{item.name}</span>
                      </div>
                    )
                  })
                }
                <div style={{cursor:'pointer'}} onClick={() => {changeCurrentBuilding(0)}}>+</div>
              </div>
              <div className={styles.buildingFormContainer}>
                  <div className={styles.operationDiv}>
                    <SvgIcon
                      tipTitle='编辑'
                      name='update'
                      width={25}
                      height={25}
                      color="rgb(56, 220, 255)"
                      onClick={handleUpdateDormitory}
                    />
                    <SvgIcon
                      tipTitle='删除'
                      name='delete'
                      width={25}
                      height={25}
                      color="rgb(56, 220, 255)"
                      onClick={handleDeleteDormitory}
                    />
                  </div>
                  <BaseForm
                    ref={buildingForm}
                    {...buildingFormProps}
                    formItemLayout={BuildingFormItemLayout}
                  />
              </div>
            </div>
            : ''
        }
      <Modal
        title='新增值班安排'
        className={styles.scheduleModal}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText='添加'
        cancelText='取消'
        closable={false}
      >
        <BaseForm
          ref={scheduleForm}
          {...scheduleFormProps}
          formItemLayout={scheduleFormItemLayout}
        />
      </Modal>
      </div>
    </div>
  )
};
