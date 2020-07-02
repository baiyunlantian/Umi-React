//今日实时体温统计统计
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';
import { getHealthLeft } from '@/services/health';
import SvgIcon from '@/components/svg/icon';

export default () => {

  const [animalHeat, setAnimalHeat] = useState({
    exceptionTotal: 0,
    normalTotal:0,
    allTotal:0,
    ratioAllTotal:'',
    ratioNormalTotal:'',
    ratioExceptionTotal:''
  });
  const [ymd, setYmd] = useState(0);

  useEffect(()=>{
    getHealthLeft({ymd}).then(res=>{
      if (res.data){
        setAnimalHeat(res.data);
      }
    });
  },[]);

  const selectTime = (ymd:number) => {
    setYmd(ymd);
    getHealthLeft({ymd}).then(res=>{
      if (res.data){
        setAnimalHeat(res.data);
      }
    });
  };

  //今日体温
  const option = {
    series: [
      {
        silent:true,
        name: '体温',
        type: 'pie',
        radius: ['75%', '85%'],
        zlevel:2,
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: animalHeat.exceptionTotal || 0,
            name: '异常体温',
            itemStyle:{
              color:'red',
              opacity:0,
            },
            label: {
              show:false,
            }
          },
          {
            value: animalHeat.normalTotal || 0,
            name: '正常体温人数',
            label: {
              show: true,
              position: 'center',
              color: '#63f9fe',
              fontSize: 20,
              formatter: '{d}%',
            },
            itemStyle:{
              opacity: animalHeat.normalTotal == 0 ? 0 : 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgb(62, 178, 245)' // 0% 处的颜色
                }, {
                  offset: 0.32, color: 'rgb(6, 66, 215)' // 32% 处的颜色
                },{
                  offset: 1, color: 'rgb(99, 249, 254)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          },
        ],
      },
      {
        silent:true,
        name: '黑环',
        type: 'pie',
        radius: ['77%', '83%'],
        zlevel:1,
        avoidLabelOverlap: false,
        labelLine: { show: false },
        label:{show:false},
        data: [
          {value: 1, name: '黑环',
            itemStyle:{color:'rgb(22, 35, 52)'}},
        ],
      },
      {
        silent:true,
        name: '内环',
        type: 'pie',
        radius: ['65%', '67%'],
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        data: [
          {
            value: 0,
            name: '正常体温',
            itemStyle:{
              color:'rgb(30, 87, 119)',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 255, 255,1)',
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

  return(
    <div className={styles.today}>

      <div className={styles.title}>
        <div className={styles.text}>{ymd == 0 ? '今日': '本月'}实时体温统计</div>
        <div className={styles.time}>
          <span className={ymd == 1 ? styles.active : ''} onClick={()=>selectTime(1)}>月|</span>
          <span className={ymd == 0 ? styles.active : ''} onClick={()=>selectTime(0)}>日</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.text}>实时体温统计人数</div>
          <div className={styles.number}>
            {
              (animalHeat.allTotal || 0).toString().padStart(5, '0').split("").map((item)=>{
                return(
                  <span>{item}</span>
                )
              })
            }
          </div>
          <div className={styles.increase}>
            环比　<SvgIcon
                    name={animalHeat.ratioAllTotal > 0 ? 'rise' : 'decline'}
                    width={16}
                    height={16}
                    color={animalHeat.ratioAllTotal > 0 ? 'green' : 'red'}
                    className={styles.svgIcon}
                  />　{animalHeat.ratioAllTotal || '0'}%
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.des}>
            <div className={styles.normalHeat}>
              <div>正常体温人数</div>
              <div className={styles.number}>
                <div><span>{animalHeat.normalTotal}</span>人</div>
                <div>环比　<SvgIcon
                    name={animalHeat.ratioNormalTotal > 0 ? 'rise' : 'decline'}
                    width={16}
                    height={16}
                    color={animalHeat.ratioNormalTotal > 0 ? 'green' : 'red'}
                    className={styles.svgIcon}
                  />　{animalHeat.ratioNormalTotal || '0'}%</div>
              </div>
            </div>
            <div className={styles.exceptionHeat}>
              <div>异常体温人数</div>
              <div className={styles.number}>
                <div><span>{animalHeat.exceptionTotal}</span>人</div>
                <div>环比　<SvgIcon
                    name={animalHeat.ratioExceptionTotal > 0 ? 'rise' : 'decline'}
                    width={16}
                    height={16}
                    color={animalHeat.ratioExceptionTotal > 0 ? 'green' : 'red'}
                    className={styles.svgIcon}
                  />　{animalHeat.ratioExceptionTotal || '0'}%</div>
              </div>
            </div>
          </div>
          <div className={styles.graph}>
            <ECharts option={option}/>
          </div>
        </div>
      </div>

    </div>
  )
};

