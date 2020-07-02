//体温趋势图
import React, { useState, useEffect, useMemo } from 'react';
import ECharts from '@/pages/components/echart';
import echarts from 'echarts/lib/echarts';
import styles from '../detail.less';
import WrappedSearchArea from '@/pages/components/searchArea';
import { getPersonAnimalHeatList } from '@/services/health';

export default ({personId}) => {

  const [animalHeatList, setAnimalHeatList] = useState([]);
  const [ymd, setYmd] = useState(0);
  const [arr,setS] = useState([]);

  useEffect(()=>{

    getPersonAnimalHeatListFn(ymd);

  },[]);

  const getPersonAnimalHeatListFn = (ymd:number) => {
    getPersonAnimalHeatList({ymd,personId}).then(res=>{
      if (res.data && res.data.list.length > 0){
        setAnimalHeatList(res.data.list);
      }else {
        setAnimalHeatList([]);
      }
    });
  };

  const customOnChange = (dates,dateStrings) => {
    let startTime = dateStrings[0];
    let endTime = dateStrings[1];
    if (startTime == '' || endTime == ''){
      getPersonAnimalHeatList({ymd:0,personId}).then(res=>{
        if (res.data && res.data.list.length > 0){
          setAnimalHeatList(res.data.list);
        }else {
          setAnimalHeatList([]);
        }
      });
      setYmd(0);
    }else {
      startTime = startTime.replace(/\//g,'-')+' 00:00:00';
      endTime = dateStrings[1].replace(/\//g,'-')+' 00:00:00';
      getPersonAnimalHeatList({startTime,endTime,personId}).then(res=>{
        if (res.data && res.data.list.length > 0){
          setAnimalHeatList(res.data.list);
        }else {
          setAnimalHeatList([]);
        }
      });
      setYmd(3);
    }
  };

  const searchProps = {
    searchForm:[{
      name: 'createTime',
      label: '日期',
      type: 'range-picker',
      onChange:customOnChange
    }],
  };

  const handleHeatData = () => {
    let array = [];
    const lt = {
      itemStyle: {
        color: new echarts.graphic.LinearGradient(
          0, 0, 0, 1,
          [
            {offset: 0, color: 'rgb(56, 217, 253)'},
            {offset: 1, color: 'rgba(56, 217, 253,0.3)'}
          ]
        )
      },
      emphasis:{
        label:{
          show:true,
          color:'rgb(56, 217, 253)',
          position:'top'
        }
      },
    };
    const gt = {
      itemStyle: {
        color: new echarts.graphic.LinearGradient(
          0, 0, 0, 1,
          [
            {offset: 0, color: 'rgb(255, 0, 0)'},
            {offset: 1, color: 'rgba(255, 0, 0,0.3)'}
          ]
        )
      },
      label:{
        show:true,
        color:'rgb(255, 0, 0)',
        position:'top'
      }
    };
    (animalHeatList || []).map(item =>
      item.bodyState == 1
        ? array.push({value:item.temp,...gt})
        : array.push({value:item.temp,...lt})
    );
    return array;
  };

  const TimeDataArray = useMemo(() => {
    let array = [];

    if (animalHeatList.length > 0){
      animalHeatList.map(item => {
        // let date = new Date(item.sendTime);
        // alert(date);
        // const m = date.getMonth() + 1;
        // const d = date.getDate();
        array.push(item.sendTime.slice(6,10));
      });
    }
    return array;
  }, [animalHeatList])

  //体温趋势
  const option = {
    color: ['#3398DB'],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: TimeDataArray,
        axisTick: {
          alignWithLabel: true,
          show:false
        },
        axisLabel:{
          color:'white'
        },
        axisLine:{
          lineStyle:{
            color:'white'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min:36.0,
        max:39.5,
        axisTick: {
          show:false
        },
        axisLine: {
          lineStyle:{
            color:'white'
          }
        },
        axisLabel:{
          color:'white'
        },
        splitLine: {
          lineStyle: {
            color: 'gray',
            type:'dotted'
          }
        },
      }
    ],
    series:
      {
        name: '直接访问',
        type: 'bar',
        barWidth: '30%',
        markLine:{
          data:[
            {
              name:'1',
              yAxis:37.3,
              symbol:'none',
              lineStyle:{
                color:'rgb(255,0,0)'
              }
            }

          ]
        },
        data: handleHeatData(),
      },

  };

  const clickTab = (tab:number) => {
    setYmd(tab);
    getPersonAnimalHeatListFn(tab);
  };

  return(
    <div className={styles.bottom}>
      <div className={styles.title}>体温趋势图</div>
      <div className={styles.tab}>
        <div className={styles.text}>
          <span style={ymd == 0 ? {color:'rgb(43, 193, 230)'} : {color:'gray'}} onClick={() => clickTab(0)}>近7天趋势图</span>
          <span className={styles.splitLine}>|</span>
          <span style={ymd == 1 ? {color:'rgb(43, 193, 230)'} : {color:'gray'}} onClick={() => clickTab(1)}>近15天趋势图</span>
          <span className={styles.splitLine}>|</span>
          <span style={ymd == 2 ? {color:'rgb(43, 193, 230)'} : {color:'gray'}} onClick={() => clickTab(2)}>近30天趋势图</span>
        </div>
        <WrappedSearchArea {...searchProps} />
      </div>
      <div className={styles.graph}>
        <ECharts option={option} />
      </div>
    </div>
  )
};
