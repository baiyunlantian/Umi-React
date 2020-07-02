//体温角色分析
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';
import { getHealthRight } from '@/services/health';

export default () => {

  const [normalList, setNormalList] = useState([]);
  const [exceptionList, setExceptionList] = useState([]);
  const [ymd, setYmd] = useState(0);

  useEffect(()=>{
    getHealthRightFn(ymd);
  },[]);

  const selectTime = (ymd:number) => {
    setYmd(ymd);
    getHealthRightFn(ymd);
  };

  const getHealthRightFn = (ymd:number) => {
    getHealthRight({ymd}).then(res=>{
      let normal = [];
      let exception = [];
      if (res){
        if (res.data.list && res.data.list.length > 0){
          res.data.list.forEach(item =>
            item.bodyState == 0 ? normal.push({value:item.total,name:item.roleName}) : exception.push({value:item.total,name:item.roleName}));
        }
      }

      setNormalList(normal);
      setExceptionList(exception);
    });
  };

  //体温角色分析
  const roleAnalyzeOptions = {
    color:['rgb(58, 225, 255)','rgb(131, 146, 255)','rgb(110, 255, 150)','rgb(60, 97, 255)'],
    legend:{
      textStyle:{
        color:'#fff',
        fontSize:14
      },
      width:'45%',
      itemWidth:10,
      itemHeight:10,
      bottom:5,
    },
    series: [
      {
        name: '异常体温',
        type: 'pie',
        radius: ['63%', '70%'],
        avoidLabelOverlap: false,
        left:'50%',
        label:{
          show:false,
          position:'center',
        },
        labelLine: {
          show:false,
          length:20,
          length2:50,
        },
        emphasis: {
          labelLine: {
            show:true,
          },
          label:{
            show:true,
            formatter:'{c}人\n占{d}%',
            fontSize:18,
          }
        },
        data: exceptionList
      },
      {
        name: '内环',
        type: 'pie',
        radius: ['57%', '58%'],
        left:'50%',
        avoidLabelOverlap: false,
        label: {show: false,},
        labelLine: { show: false },
        data: [
          {
            value: 0,
            name: '',
            itemStyle:{
              color:'rgb(30, 87, 119)',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(61, 253, 249,1)',
            },
          },
        ],
      },
      {
        name: '正常体温',
        type: 'pie',
        radius: ['63%', '70%'],
        avoidLabelOverlap: false,
        right:'50%',
        label:{
          show:false,
          position:'center',
        },
        labelLine: {
          show:false,
          length:20,
          length2:50,
        },
        emphasis: {
          labelLine: {
            show:true,
          },
          label:{
            show:true,
            formatter:'{c}人\n占{d}%',
            fontSize:18,
          }
        },
        data: normalList
      },
      {
        name: '内环',
        type: 'pie',
        radius: ['57%', '58%'],
        right:'50%',
        avoidLabelOverlap: false,
        label: {show: false,},
        labelLine: { show: false },
        data: [
          {
            value: 0,
            name: '',
            itemStyle:{
              color:'rgb(30, 87, 119)',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(61, 253, 249,1)',
            },
          },
        ],
      }

    ]
  };

  return(
    <div className={styles.analyze}>
      <div className={styles.title}>
        <div className={styles.text}>体温角色分析</div>
        <div className={styles.time}>
          <span className={ymd == 1 ? styles.active : ''} onClick={()=>selectTime(1)}>月|</span>
          <span className={ymd == 0 ? styles.active : ''} onClick={()=>selectTime(0)}>日</span>
        </div>
      </div>
      <div className={styles.graph}>
        <div className={styles.graphTitle}>
          <div>正常体温</div>
          <div>异常体温</div>
        </div>
        <ECharts option={roleAnalyzeOptions} />
      </div>
    </div>
  )
};
