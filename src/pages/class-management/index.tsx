import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/pages/components/custom-table';
import styles from './index.less';
import ECharts from '@/pages/components/echart';
import SearchArea from '@/pages/components/searchArea';
import { Link } from 'umi';
import { getClassStatisticsInfo, selectClassFuzzyDownList} from '@/services/class';
import { selectPersonFuzzyDownList } from '@/services/person';
import { message } from 'antd';

export default () => {

  const [classList, setClassList] = useState([]);
  const [totalClass, setTotalClass] = useState();
  const {campusId} = JSON.parse(window.localStorage.getItem('currentCampus'));

  useEffect(()=>{
    getClassStatisticsInfo({ id: campusId}).then(res=>{
      if (res.data){
        if (res.data.classInfoList && res.data.classInfoList.length > 0){
          const {classInfoList} = res.data;
          setClassList(classInfoList);
          let totalClass = 0;
          classInfoList.forEach(item=>{
            totalClass += item.classCount;
          });
          setTotalClass(totalClass);
        }
      }
    });

    //班主任
    selectPersonFuzzyDownList({roleId:7}).then(res=>{
      if (res.data && res.data.length > 0){
        const list: any[] = [];
        res.data.map(item=>{
          const {personId:key, name:label} = item;
          list.push({key,label});
        });
        setTeacherList(list);
      }
    });
  },[]);

  const customTable = useRef();
  const customSearch = useRef();
  const [teacherList, setTeacherList] = useState<any>([]);
  const [filterClassList, setFilterClassList] = useState([]);
  const [searchTeacherName, setSearchTeacherName] = useState('');

  const handleSearch = values => {
    Object.keys(values).forEach(key=>values[key] ? '' : delete values[key]);
    if (values.headTeacherName){
      values.headTeacherName = searchTeacherName;
    }
    customTable.current.search(values);
  };

  const filterClass = (value:string) => {
    if (value.length >= 2){
      selectClassFuzzyDownList({className:value}).then(res=>{
        if (res.data && res.data.length > 0){
          const list = res.data.map(item=>{
            const {className:key, className:label} = item;
            return {key, label};
          });
          setFilterClassList(list);
          customSearch.current.resetFields();
        }
      });
    }
  };

  const handleData = () => {
    let array = [];

    classList.forEach(item=>{
      array.push({value:item.classCount,name:item.departmentName + item.gradeName});
    });

    return array;
  };

  const searchProps = {
    handleSearch,
    searchForm: [
      { name:'gradeName', type: 'input', label: '年级', },
      {
        name:'className', type: 'select', label: '班级',
        options:filterClassList,
        filterOption:true,
        onSearch:filterClass,
        showSearch:true
      },
      {
        name:'headTeacherName',
        type: 'select',
        label: '班主任',
        options:teacherList,
        onChange:(value:any, options:any) => {setSearchTeacherName(options.children)},
        filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
        showSearch:true
      }

    ],
  };

  //班级信息列表
  const visitorsTableProps = {
    url: '/api/data/class/allClassList',
    pageSize:9,
    params:{
      campusId
    },
    tableFields: {
      rowKey: 'classId',
      columns: [
        {
          title: '年级',
          dataIndex: 'gradeName',
          width: '15%',
          editable: true,
          key: 'gradeName',
          render : (text ,record) => (<div>({record.departmentName}) {record.gradeName}</div>)
        },
        {
          title: '班级',
          dataIndex: 'className',
          width: '10%',
          editable: true,
          key: 'className',
        },
        {
          title: '人数',
          dataIndex: 'boyCount',
          width: '5%',
          editable: true,
          key: 'boyCount',
          render : (text ,record) => (<div>{record.boyCount + record.girlCount}</div>)
        },
        {
          title: '班主任',
          dataIndex: 'teacherName',
          width: '10%',
          editable: true,
          key: 'teacherName',
        },
        {
          title: '手机',
          dataIndex: 'phone',
          width: '10%',
          editable: true,
          key: 'phone',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '15%',
          editable: true,
          key: 'remark',
        },
        {
          title: '操作',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <div className={styles.operation}>
              <Link
                to={'/class-management/detail?departmentId='+record.departmentId+'&gradeId='+record.gradeId+'&classId='+record.classId}
                style={{fontWeight: 'bold',color:'#39fdff'}}
              >
                ···
              </Link>
            </div>
          ),
        },
      ],
    },
  };

  //各年级占比
  const classOptions = {
    color:['rgb(56, 220, 255)','rgb(53, 116, 245)','rgb(162, 152, 255)','rgb(91, 240, 154)','rgb(255, 219, 92)','rgb(255, 159, 127)'],
    series: [
      {
        name: '各年级占比',
        type: 'pie',
        center: ['50%', '50%'],
        roseType:'radius',
        avoidLabelOverlap: false,
        label:{
          show:true,
          formatter:'{d}%',
        },
        labelLine: {
          show:true,
          length:10,
          length2:20
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
      }
    ]
  };


  return (
    <div className='custom-main-content'>
      <div className={styles.peopleManagement}>
      <div className={styles.top}>
        <div className={styles.analyze}>
          <div className={styles.title}>
            <div className={styles.text}>班级统计</div>
          </div>
          <div className={styles.content}>
            <div className={styles.totalClass}>
              <div>总班级数</div>
              <div><span>{totalClass}</span>个</div>
            </div>
            <div className={styles.graph}>
              <ECharts option={classOptions}/>
            </div>
            <div className={styles.infoList}>
              {
                (classList || []).map(item=>{
                  return(
                    <div className={styles.infoItem}>
                      <div className={styles.colOne}>{item.departmentName + item.gradeName}班级数：</div>
                      <div className={styles.colTwo}>{item.classCount || 0}</div>
                      <div className={styles.colThree}>个</div>
                      <div className={styles.colFour}>人数：</div>
                      <div className={styles.colFive}>{item.boyCount + item.girlCount || 0}</div>
                      <div className={styles.colSix}>人</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <SearchArea {...searchProps} ref={customSearch}>
        <Link className={styles.addButton} to={{pathname:'/class-management/detail'}}>添加班级</Link>
      </SearchArea>
      <CustomTable ref={customTable} {...visitorsTableProps} />
    </div>
    </div>
  );
};
