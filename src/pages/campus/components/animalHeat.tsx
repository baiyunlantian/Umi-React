//某校区实时体温统计
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';
import { getCampusAnimalHeat } from '@/services/campus';
import Visitor from '@/pages/campus/components/visitor';

export default ({campusName}) => {

  const [list, setList] = useState([]);
  const [normal, setNormal] = useState(0);
  const [exception, setException] = useState(0);
  const [total, setTotal] = useState(0);
  const [normalOffset, setNormalOffset] = useState('');
  const [exceptionOffset, setExceptionOffset] = useState('');
  const [ymd, setYmd] = useState(0);

  useEffect(()=>{
    getCampusAnimalHeatFn(ymd);
  },[]);

  const selectTime = (ymd:number) => {
    setYmd(ymd);
    getCampusAnimalHeatFn(ymd);
  };

  const getCampusAnimalHeatFn = (ymd:number) => {
    getCampusAnimalHeat({ymd}).then(res=>{
      if (res.data){
        const {roleList, normal, exception, total} = res.data;
        setList(roleList);
        setNormal(normal);
        setTotal(total);
        setException(exception);
        const nOffset = Math.ceil(normal/total * 100) || 0;
        const eOffset = Math.ceil(exception/total * 100) || 0;
        setNormalOffset(nOffset+'%');
        setExceptionOffset(eOffset+'%');
      }
    });
  };

  const handleData = () => {
    let array = [];

    (list || []).map(item=>{
      if (item.bodyState === 1) {
        array.push({value:item.total,name:item.roleName});
      }
    });

    return array;
  };

  //体温统计
  const option = {
    title:{
      show:true,
      text:' 异常角色分析',
      textStyle:{
        color:'#fefefe',
        fontSize: 16,
      },
      top: 10,
      left: 10,
    },
    color:['rgb(58, 255, 148)','rgb(182, 161, 255)','rgb(38, 171, 255)','rgb(46, 144, 255)'],
    legend: [
      {
        orient: 'horizontal',
        bottom:'3%',
        itemHeight:10,
        itemWidth:10,
        textStyle:{
          color:'#fff',
          fontSize:12,
        }
      }
    ]
    ,
    series: [
      {
        name: '访问来源',
        type: 'pie',
        width:'30%',
        left:'center',
        zlevel:1,
        avoidLabelOverlap: false,
        data: [
          {value: 1, name: ''},
        ],
        label:{show:false},
        itemStyle:{
          color:'rgba(46, 144, 255, 0.2)'
        },
      },
      {
        zlevel:2,
        name: '角色分析',
        type: 'pie',
        radius: ['0%', '40'],
        avoidLabelOverlap: false,
        label:{
          show:false,
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
            formatter:'{c}',
            fontSize:18,
          }
        },
        data: handleData()
      }]
  };

  return(
    <div className={styles.bottomLeft}>
      <div className={styles.title}>
        <div className={styles.text}>{campusName}实时体温统计</div>
        <div className={styles.time}>
          <span className={ymd == 1 ? styles.active : ''} onClick={()=>selectTime(1)}>月|</span>
          <span className={ymd == 0 ? styles.active : ''} onClick={()=>selectTime(0)}>日</span>
        </div>
      </div>
      <div className={styles.heat}>
        <div className={styles.normalHeat}>
          <div className={styles.type}>正常体温统计人数</div>
          <div className={styles.bar}>
            <div className={styles.tipsCount} style={{left:normalOffset}}>{normal}</div>
            <div className={styles.barPresent} style={{width:normalOffset}}></div>
          </div>
        </div>
        <div className={styles.exceptionHeat}>
          <div className={styles.type}>异常体温统计人数</div>
          <div className={styles.bar}>
            <div className={styles.tipsCount} style={{left:exceptionOffset}}>{exception}</div>
            <div className={styles.barPresent} style={{width:exceptionOffset}}></div>
          </div>
        </div>
      </div>
      <ECharts option={option} />
    </div>
  )
};
