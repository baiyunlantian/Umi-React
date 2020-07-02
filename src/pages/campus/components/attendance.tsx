//某校区实时考勤人数统计
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';

export default (
  {
    campusRule,
    campusDTO,
    dormitoryRule,
    campusName,
    dormitoryDTO
  }) => {

  let dTotal = 0, dNormalAttendanceNum = 0,notBackNum = 0, notLeaveNum = 0, cNotAttendanceTotal = 0, cAlreadyAttendanceTotal = 0, cAllTotal = 0;

  if (campusDTO){
    cNotAttendanceTotal = campusDTO.notAttendanceTotal;
    cAlreadyAttendanceTotal = campusDTO.alreadyAttendanceTotal;
    cAllTotal = campusDTO.allTotal;
  }
  if (dormitoryDTO){
    dTotal = dormitoryDTO.allTotal;
    dNormalAttendanceNum = dormitoryDTO.normalAttendanceNum;
    notBackNum = dormitoryDTO.passTimeNotBackNum;
    notLeaveNum = dormitoryDTO.passTimeNotLeaveNum;
  }

  //考勤统计
  const option = campusRule ?  {
    legend: [
      {
        orient: 'horizontal',
        bottom:'3%',
        itemHeight:10,
        itemWidth:10,
        textStyle:{
          color:'#fff',
          fontSize:12,
        },
        selectedMode:false
      }
    ],
    color:['rgb(55, 250, 174)','rgb(128, 128, 128)'],
    series: [
      {
        silent:true,
        zlevel:2,
        name: '已考勤',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: cAlreadyAttendanceTotal,
            name: `已考勤`,
            label: {
              formatter: '{d}%',
              show: true,
              position: 'center',
              color: '#37faae',
              fontSize: 24
            },
            itemStyle:{
              color: '#37faae',
            },
          },
          {
            value: cNotAttendanceTotal,
            name: `未考勤`,
            itemStyle:{
              color:'gray',
              opacity:cNotAttendanceTotal == 0 ? 1 : 0,
            },
            label: {
              show:false,
            }
          },
        ],
      },
      {
        silent:true,
        zlevel:1,
        name: '黑环',
        type: 'pie',
        radius: ['55%', '60%'],
        avoidLabelOverlap: false,
        labelLine: { show: false },
        data: [
          {
            value: 1,
            name: '',
            label: {
              formatter:'考勤占比',
              position:'center',
              color:'#d2d2d2',
              fontSize: 12,
              padding:[50,0,0,0],
            },
            itemStyle:{
              color:'gray',
            }},
        ],
      },
    ]
  } : {};
  //住校
  const option_2 = dormitoryRule ? {
    series: [
      {
        silent:true,
        name: '今日来访人数',
        type: 'pie',
        radius: ['55%', '65%'],
        avoidLabelOverlap: false,
        label:{show:false},
        data: [
          //左半圆
          {
            label:{
              show:true,
              color:'rgb(56, 220, 255)',
              fontSize:22,
              padding:[0,0,0,0],
              formatter:'{d}%',
              position:'center'
            },
            value: dNormalAttendanceNum,
            name: '正常考勤',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(56, 220, 255)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(56, 220, 255,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
          //右半圆
          {
            value: dTotal - dNormalAttendanceNum,
            name: '未考勤',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(56, 220, 255,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(56, 220, 255,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
        ],
      },
      {
        silent:true,
        zlevel:1,
        name: '黑环',
        type: 'pie',
        radius: ['55%', '60%'],
        avoidLabelOverlap: false,
        labelLine: { show: false },
        data: [
          {
            value: 1,
            name: '',
            label: {
              formatter:'正常考勤',
              position:'center',
              color:'#d2d2d2',
              fontSize: 12,
              padding:[50,0,0,0],
            },
            itemStyle:{
              color:'gray',
              opacity:0
            }},
        ],
      },
    ]
  }: {};

  return(
    <div className={styles.attendance}>
      <div className={styles.title}>
        <div className={styles.text}>{campusName}实时考勤统计</div>
      </div>
      <div className={styles.main}>
        {campusRule == true ?  <div className={styles.campusContainer}>
          <div className={styles.total}>考勤人数：<span>{cAllTotal}</span>人</div>
          <ECharts option={option} />
          <div className={styles.cFooter}>
            <div><span style={{color:'rgb(55, 250, 174)'}}>{cAlreadyAttendanceTotal}</span>人</div>
            <div><span>{cNotAttendanceTotal}</span>人</div>
          </div>
        </div>
          : <div className={styles.notHaveRule}>暂无数据</div>
        }
        {dormitoryRule == true ? <div className={styles.dormitoryContainer}>
            <div className={styles.total}>住校人数：<span>{dTotal}</span>人</div>
            <ECharts option={option_2} />
            <div className={styles.dFooter}>
              <div>寝室正常考勤人数：<span style={{color:'rgb(56, 220, 255)'}}>{dNormalAttendanceNum}</span>人</div>
              <div>超时未归：<span style={{color:'rgb(255, 0, 0)'}}>{notBackNum}</span>人</div>
              <div>超时未离开：<span style={{color:'rgb(255, 0, 0)'}}>{notLeaveNum}</span>人</div>
            </div>
        </div>
          : <div className={styles.notHaveRule}>暂无数据</div>
        }
      </div>
    </div>
  )
};
