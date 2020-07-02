//校区实时统计详情
import React, { useState, useEffect, useRef } from 'react';
import PersonCount from './components/person-count';
import Visitor from './components/visitor';
import Attendance from './components/attendance';
import AnimalHeat from './components/animalHeat';
import ExceptionAnimalHeat from './components/exceptionAnimalHeat';
import {
  getCampusPerson,
  getCampusAttendance,
  getCampusAnimalHeat,
  getCampusExceptionAnimalHeat
} from '@/services/campus';
import styles from './index.less';

export default () => {

  const [personProps, setPersonProps] = useState([]);
  const [attendanceProps, setAttendanceProps] = useState({});
  const [exceptionProps, setExceptionProps] = useState([]);
  const {campusName} = JSON.parse(window.localStorage.getItem('currentCampus')!);
  useEffect(()=>{
    getCampusPerson().then(res=>{
      if (res.data){
        if (res.data.list && res.data.list.length > 0) setPersonProps(res.data.list.reverse());
      }
    });

    getCampusAttendance().then(res=>{
      if (res.data) setAttendanceProps(res.data);
    });

    getCampusExceptionAnimalHeat().then(res=>{
      if (res.data){
        if (res.data.list && res.data.list.length > 0) setExceptionProps(res.data.list);
      }
    });

  },[]);

  return (
    <div className='custom-main-content'>
      <div className={styles.campusDetail}>
        <div className={styles.top}>
          <PersonCount campusName={campusName} list={personProps} />
          <div className={styles.topRight}>
            <Visitor campusName={campusName} />
            <Attendance campusName={campusName} {...attendanceProps} />
          </div>
        </div>
        <div className={styles.bottom}>
          <AnimalHeat campusName={campusName} />
          <ExceptionAnimalHeat campusName={campusName} list={exceptionProps}/>
        </div>
      </div>
    </div>
  )
}
