//个人信息和健康分析图
import React, { useState, useEffect, useRef } from 'react';
import BaseForm from '@/pages/components/base-form';
import ECharts from '@/pages/components/echart';
import echarts from 'echarts/lib/echarts';
import styles from '../detail.less';
import { useModel } from 'umi';

export default (
  {
    personInfo,
    roleName,
    healthAnalysis:{allTotal, exceptionTotal, ratioAllTotal, ratioExceptionTotal }
  }) => {

  const baseForm = useRef();
  const [dormitoryList, setDormitoryList] = useState<any>([])
  const { getDormitory } = useModel('dormitory');
  useEffect(() => {
    getDormitory().then(list => {
      studentFormList.forEach(item=>{
        if (item.name === 'dormitoryCode'){
          item.options = list;
          setDormitoryList(list);
          return;
        }
      })
    });
  }, [])

  const studentFormList = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'sex', label: '性别', type: 'input', },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'roleName', label: '角色', type: 'input' },
    { name: 'className', label: '所在班级', type: 'input' },
    { name: 'code', label: '学号', type: 'input', },
    { name: 'teacherName', label: '班主任', type: 'input' },
    { name: 'teacherPhone', label: '联系方式', type: 'input' },
    { name:'dormitoryName', label:'宿舍', type:'input', },
    { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea},
  ];

  const teacherFormList = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'sex', label: '性别', type: 'input', },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'roleName', label: '角色', type: 'input' },
    { name: 'code', label: '工号', type: 'input', },
    { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea },
  ];

  const visitorFormList = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'sex', label: '性别', type: 'input', },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'roleName', label: '角色', type: 'input' },
    { name: 'visitTime', label: '来访时间', type: 'input', },
    { name: 'reason', label: '来访理由', type: 'input', },
    { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea },
  ];

  const logisticsFormList = [
    { name: 'name', label: '姓名', type: 'input' },
    { name: 'sex', label: '性别', type: 'input', },
    { name: 'ipNum', label: '身份证号', type: 'input' },
    { name: 'phone', label: '手机号', type: 'input' },
    { name: 'roleName', label: '角色', type: 'input' },
    { name: 'code', label: '工号', type: 'input', },
    { name: 'remark', label: '备注', type: 'textarea', className: styles.textarea },
  ];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 14 }
    }
  };

  const formProps = {
    initialValues:personInfo,
    hiddenFooter: true,
    formList:
      roleName === '学生' ? studentFormList :
        roleName === '老师' ? teacherFormList :
          roleName === '后勤' ? logisticsFormList : visitorFormList,
  };

  //健康指数图
  const option = {
    title: {
      top: '45%',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14
      },
      subtext: '正常体温',
      subtextStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    series: [{
      type: 'liquidFill',
      radius: '70%',
      center: ['50%', '40%'],
      data: [((allTotal-exceptionTotal)/allTotal) || 0, ((allTotal-exceptionTotal)/allTotal) || 0],
      backgroundStyle: {
        borderWidth: 2,
        borderColor: '#459DBD',
        color: 'rgba(23, 38, 59, 0.9)'
      },
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
        offset: 1,
        color: 'rgba(135, 241, 244, 0.36)'
      }, {
        offset: 0,
        color: 'rgba(73, 126, 255, 0.7)'
      }]),
      itemStyle: {
        shadowBlur: 0,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 1,
          color: 'rgba(135, 241, 244, 0.7)'
        }, {
          offset: 0,
          color: 'rgba(73, 192, 255, 0.7)'
        }]),
        opacity: 1,
      },
      outline: {
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgba(73, 192, 255, 0.7)',
          borderType: 'dashed',
        }
      },
      label:{
        fontSize:28
      }
    }]
  };

  return(
    <div className={styles.top}>
      <div className={styles.info}>
        <div className={styles.title}>个人信息</div>
        <div className={styles.content}>
          <div className={styles.img}>
            <img src={personInfo.url} alt='***'/>
          </div>
          <BaseForm
            ref={baseForm}
            {...formProps}
            formItemLayout={formItemLayout}
          />
        </div>
      </div>
      <div className={styles.analyze}>
        <div className={styles.goBack} onClick={ () => {history.back()}}>返回</div>
        <div className={styles.title}>健康指数分析</div>
        <div className={styles.content}>
          <div className={styles.des}>
            <div className={styles.checkTime}>
              <div>最近30天检测次数</div>
              <div className={styles.number}>
                <div><span>{allTotal}</span>次</div>
                <div>环比{ratioAllTotal || 0}</div>
              </div>
            </div>
            <div className={styles.exceptionTime}>
              <div>最近30天异常次数</div>
              <div className={styles.number}>
                <div><span>{exceptionTotal}</span>次</div>
                <div>环比{ratioExceptionTotal || 0}</div>
              </div>
            </div>
          </div>
          <div className={styles.graph}>
            <ECharts option={option} />
          </div>
        </div>
      </div>
    </div>
  )
};
