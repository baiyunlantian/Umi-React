//健康详情页面
import React, { useState, useEffect,useRef } from 'react';
import styles from './detail.less';
import PersonInfo from './components/personInfo';
import AnimalHeatList from './components/animalHeatList';
import { getHealthPersonDetail } from '@/services/health';


export default props => {

  const {personId,roleId} = props.location.query;
  const [personData,setPersonData] = useState({
    personInfo:{},
    healthAnalysis:{
      allTotal:0,
      exceptionTotal:0,
      ratioAllTotal:0,
      ratioExceptionTotal:0
    }
  });

  useEffect(()=>{

    getHealthPersonDetail({personId,roleId:roleId}).then(res=>{
      if (res.data && res.data.personInfo){
        res.data.personInfo.sex == 1 ? res.data.personInfo.sex = '男' : res.data.personInfo.sex = '女';
        setPersonData({roleName:res.data.personInfo.roleName,...res.data});
      }
    });

  },[]);


  return (
    <div className='custom-main-content'>
      <div className={styles.healthDetail}>
        <PersonInfo {...personData}/>
        <AnimalHeatList personId={personId}/>
      </div>
    </div>
  );
};
