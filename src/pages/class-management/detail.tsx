import React, { useEffect, useState, useRef } from 'react';
import ClassInfo from './componments/classInfo';
import StudentList from './componments/studentList';
import DeleteModal from './componments/deleteModal';
import {
  getGradeDetailInfo,
  getClassDetail,
  getGradeList,
  getClassList,
  getDepartment,
  delClass,
  upgrade
} from '@/services/class';
import styles from './detail.less';
import { Checkbox, Modal, message } from 'antd';
import currentClassImg from '@/assets/class/class_active.png';
import classImg from '@/assets/class/class.png';
import delImg from '@/assets/exception-query/del.png';
import { selectPersonFuzzyDownList } from '@/services/person';
import SvgIcon from '@/components/svg/icon';

export default props => {
  const campus = JSON.parse(window.localStorage.getItem('campus'));

  const [classInfo,setClassInfo] = useState({});
  const [studentList,setStudentList] = useState([]);
  const [isClickAdd, setIsClickAdd] = useState<boolean>(false);    //是否点击新增级部、年级、班级 任一 新增按钮
  const [gradeList, setGradeList] = useState([]);     //当前 初/高中部 下的所有年级
  const [classList, setClassList] = useState([]);     //当前年级下的所有班级
  const [currentGrade, setCurrentGrade] = useState<any>();                    //当前选择的年级
  const [currentClass, setCurrentClass] = useState<any>();                      //当前选择的班级
  const [showCheckbox, setShowCheckbox] = useState(false);                  //控制复选框显示/隐藏
  const [delClassModalVisible, setDelClassModalVisible] = useState(false);  //控制删除班级模态框显示/隐藏
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);  //控制年级升级模态框显示/隐藏
  const [checkboxClassIds, setCheckboxClassIds] = useState([]);             //选择删除的班级id
  const [departmentList, setDepartmentList] = useState([]);   //级部列表
  const [departmentId, setDepartmentId] = useState();   //级部id
  const [teacherList, setTeacherList] = useState<any>([]);
  const [leaderList, setLeaderList] = useState<any>([]);
  const [classCode, setClassCode] = useState<any>();

  const {campusName,campusId} = JSON.parse(window.localStorage.getItem('currentCampus'));

  //筛选人员
  const filterPerson = (value:string, roleId:number, formListParams:object) => {
    const reg = /[^\u4e00-\u9fa5]/;

    if (reg.test(value)) return;    //输入非中文时return
    if (value.length >= 2){
      selectPersonFuzzyDownList({roleId,name:value}).then(res=>{
        if (res.data){
          const list: any[] = [];
          (res.data.map || [])((item:any)=>{
            const {personId:key, name:label,phone} = item;
            list.push({key,label,phone});
          });
          setTeacherList(list);

          let formList :any [] = JSON.parse(JSON.stringify(formListParams));

          formList.forEach(item=>{
            if (item.name == 'headTeacherId'){
              item.options = list;
            }
          });
          setFormListType(formList);

        }
      });
    }
  };

  const editClassFilterPerson = (value:string) => {
    filterPerson(value,7,editClassInfoFormList);
  };
  const addClassFilterPerson = (value:string) => {
    filterPerson(value,7,addClassInfoFormList);
  };
  const editGradeFilterPerson = (value:string) => {
    filterPerson(value,6,editGradeInfoFormList);
  };
  const addGradeFilterPerson = (value:string) => {
    filterPerson(value,6,addGradeInfoFormList);
  };

  const selectHeadTeacher = (value:string, params:string) => {
    const headTeacherId = typeof value == 'object' ? value.headTeacherId : value;
    const values = baseForm.current.getFieldsValue();
    const list = params == 'class' ? teacherList : leaderList;
    let phone = '';
    (list || []).map(item=>{
      item.key == headTeacherId ? phone = item.phone : '';
    });
    values.phone = phone;
    values.headTeacherId = headTeacherId;
    Object.keys(values).forEach((key=>values[key] ? '' : values[key] = ''));
    setClassInfo(values);
  };

  //编辑班级时表单
  const editClassInfoFormList = [
    { name: 'departmentId', label: campusName, type: 'select', options:departmentList },
    { name: 'gradeId', label: '年级', type: 'select', options:gradeList },
    { name: 'name', label: '班级', type: 'input' },
    {name: 'sort', label: '排序', type: 'input' },
    {name: 'code', label: '代号', type: 'input' },
    { name: 'areaName', label: '位置', type: 'input' },
    { name: 'headTeacherId', label: '班主任', type: 'select',
      options:teacherList,
      onChange:(value:any)=>selectHeadTeacher(value,'class'),
      filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
      showSearch:true,
    },
    { name: 'phone', label: '手机号', type: 'input',disabled:true, },
    { name: 'remark', label: '备注', type: 'input' },
    { name: 'personCount', label: '班级人数', type: 'input', disabled:'disabled', className: styles.count,  },
    { name: 'dormitoryCount', label: '住校人数', type: 'input', disabled:'disabled', className: styles.count,  },
  ];
  //新增班级时表单
  const addClassInfoFormList = [
    { name: 'departmentId', label: campusName, type: 'select', options:departmentList },
    { name: 'gradeId', label: '年级', type: 'select', options:gradeList },
    { name: 'name', label: '班级', type: 'input', },
    {name: 'sort', label: '排序', type: 'input' },
    {name: 'code', label: '代号', type: 'input' },
    { name: 'areaName', label: '位置', type: 'input', },
    { name: 'headTeacherId', label: '班主任', type: 'select',
      options:teacherList,
      onChange:(value:any)=>selectHeadTeacher(value,'class'),
      filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
      showSearch:true,
    },
    { name: 'phone', label: '手机号', type: 'input',disabled:true, },
    { name: 'remark', label: '备注', type: 'input' },
  ];
  //编辑年级时表单
  const editGradeInfoFormList = [
    { name: 'departmentId', label: campusName, type: 'select', options:departmentList  },
    { name: 'name', label: '年级', type: 'input' },
    {name: 'grade', label: '排序', type: 'input' },
    { name: 'classCount', label: '班级数', type: 'input', disabled:'disabled' },
    { name: 'gradeStudentCount', label: '年级人数', type: 'input', disabled:'disabled' },
    {
      name: 'headTeacherId', label:'负责人', type:'select',
      options: leaderList,
      onChange:(value:any)=>selectHeadTeacher(value,'grade'),
      filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
      showSearch:true,
    },
    {name:'phone', label:'手机号', type:'input',disabled:true,},
    {name:'remark', label:'备注', type:'input'},
  ];
  //新增年级时表单
  const addGradeInfoFormList = [
    { name: 'departmentId', label: campusName, type: 'select', options:departmentList  },
    { name: 'name', label: '年级', type: 'input'},
    {name: 'grade', label: '排序', type: 'input' },
    {
      name: 'headTeacherId', label:'负责人', type:'select',
      options: leaderList,
      onChange:(value:any)=>selectHeadTeacher(value,'grade'),
      filterOption:(inputValue, option) =>{return option.children.indexOf(inputValue) >= 0 ?  true :  false},
      showSearch:true,
    },
    {name:'phone', label:'手机号', type:'input',disabled:true,},
    {name:'remark', label:'备注', type:'input'},
  ];
  //编辑级部时表单
  const editDepartmentInfoFormList = [
    { name: 'name', label: campusName, type: 'input' },
    {name: 'sort', label: '排序', type: 'input' },
  ];
  //新增级部时表单
  const addDepartmentInfoFormList = [
    { name: 'name', label: campusName, type: 'input' },
    {name: 'sort', label: '排序', type: 'input' },
  ];

  const [formListType, setFormListType] = useState(editDepartmentInfoFormList);   //表单列表类型
  const [formType, setFormType] = useState<string>('');   //表单类型

  const baseForm = useRef();

  useEffect(()=>{
    //判断是否通过点击  添加班级按钮  进入详情页面
    let {departmentId:did, gradeId:gid, classId:cid} = props.location.query;
    did = Number(did), gid = Number(gid), cid = Number(cid);
    console.log('props.location',props.location);

    handleInit(did,gid,cid).then();

  },[]);

  const handleInit = async (did:number, gid:number, cid:number) => {
    let teacherList: any[];
    let leaderList;
    //值班老师
    selectPersonFuzzyDownList({roleId:7}).then(res=>{
      if (res.data && res.data.length > 0){
        const list: any[] = [];
        res.data.map(item=>{
          const {personId:key, name:label,phone} = item;
          list.push({key,label,phone});
        });
        teacherList = list;
        setTeacherList(list);
      }
    });

    //值班领导
    selectPersonFuzzyDownList({roleId:6}).then(res=>{
      if (res.data && res.data.length > 0){
        const list: any[] = [];
        res.data.map(item=>{
          const {personId:key, name:label,phone} = item;
          list.push({key,label,phone});
        });
        leaderList = list;
        setLeaderList(list);
      }
    });



    let dList :any [] = [];
    let gList :any [] = [];

    try {
      const departRes = await getDepartment({campusId});
      if (!departRes.data) return;
      const {list:departmentList} = departRes.data;
      if (departmentList && departmentList.length > 0){
        dList = departmentList.map(item=>{
          const {id:key, name:label,sort} = item;
          return {key, label,sort};
        });
        setDepartmentList(dList);
        setDepartmentId(did || departmentList[0].id);
        setFormListType(editDepartmentInfoFormList);
        setClassInfo(departmentList[0]);
      }else {
        return
      }

      const gradeRes = await getGradeList({departmentId:did || departmentList[0].id});
      if (!gradeRes.data) return;
      const {list:gradeList} = gradeRes.data;
      if (gradeList && gradeList.length > 0) {
        gList = gradeList.map(item => {
          const { id: key, name: label } = item;
          return { key, label };
        });
        setGradeList(gList);
        setCurrentGrade(gid || gList[0].key);
      }else {
        return
      }

      const gradeDetailRes = await getGradeDetailInfo({ id: gid || gradeList[0].id });
      if (!gradeDetailRes.data) return;
      Object.keys(gradeDetailRes.data).forEach(key => {
        gradeDetailRes.data[key] == null ? gradeDetailRes.data[key] = '' : '';
      });
      editGradeInfoFormList.forEach(item => {
        if (item.name == 'departmentId') {
          item.options = gList;
        }
        else if (item.name == 'headTeacherId'){
          // item.options = [{ key:  gradeDetailRes.data.headTeacherId,label:gradeDetailRes.data.teacherName}];
          item.options = leaderList;
        }
      });
      setClassInfo(gradeDetailRes.data);
      setFormListType(editGradeInfoFormList);

      const classRes = await getClassList({ gradeId: gid || gradeList[0].id });
      if (!classRes.data) return ;
      const {list:classList} = classRes.data;
      if (!(classList && classList.length > 0)) return ;
      setClassList(classList);
      setCurrentClass(cid || classList[0].id);

      const classDetailRes = await getClassDetail({id:cid || classList[0].id});
      if (!classDetailRes.data) return ;
      const {personResultDtos:studentList,...classInfo} = classDetailRes.data.classInfo;
      const personCount = classInfo.boyCount + classInfo.girlCount;
      setStudentList(studentList);
      setFormType('class');
      setClassCode(classInfo.code);
      Object.keys(classInfo).forEach(key=>{
        classInfo[key] == null ?  classInfo[key] = '' : '';
      });
      editClassInfoFormList.forEach(item=>{
        if (item.name == 'departmentId'){
          item.options = dList;
        }else if (item.name == 'gradeId'){
          item.options = gList;
        }
        else if (item.name == 'headTeacherId'){
          // item.options = teacherList || [{ key:  classInfo.headTeacherId,label:classInfo.teacherName}];
          item.options = teacherList;
        }
      });
      setClassInfo({
        id: cid || classList[0].id,
        sort:classList[0].sort,
        personCount,
        ...classInfo
      });
      setFormListType(editClassInfoFormList);
    }catch (e) {
      console.log(e);
    }

  };

  //选择不同级部时
  const handleClickDepartment = (id:any) => {
    setDepartmentId(id);
    setCurrentGrade(null);
    setCurrentClass(null);
    setStudentList([]);
    setClassList([]);
    setFormType('department');
    if (id == ''){
      setGradeList([]);
      setClassInfo({});
      setIsClickAdd(true);
      //加个延时，数据改变组件重新渲染需要时间
      setTimeout(()=>{
        baseForm.current.resetFields();
        setFormListType(addDepartmentInfoFormList);
      },10);
    }else {
      setIsClickAdd(false);
      const departmentInfo = departmentList.filter(item=> item.key == id);
      setClassInfo({ name:departmentInfo[0].label,sort:departmentInfo[0].sort, id });
      setFormListType(editDepartmentInfoFormList);
      getGradeList({departmentId:id}).then(res1 => {
        if (res1.data){
          if (res1.data.list && res1.data.list.length > 0){
            const gList = res1.data.list.map(item=>{
              const {id:key, name:label} = item;
              return {key, label};
            });
            setGradeList(gList);
          }else {
            setGradeList([]);
          }
        }
      });
    }
  };

  //选择不同年级时
  const handleClickGrade = (id:any) => {
    setCurrentGrade(id);
    setCurrentClass(null);
    //清空复选框
    setShowCheckbox(false);
    setCheckboxClassIds([]);
    setDelClassModalVisible(false);
    setStudentList([]);
    setFormType('grade');

    if (id == ''){
      setIsClickAdd(true);
      setClassList([]);
      setClassInfo({});
      //加个延时，数据改变组件重新渲染需要时间
      setTimeout(()=>{
        baseForm.current.resetFields();
        setFormListType(addGradeInfoFormList);
        },10);
    }else {
      setIsClickAdd(false);
      getGradeDetailInfo({id}).then(res=>{
        if (res.data){
          const {gradeInfo} = res.data;
          Object.keys(gradeInfo).forEach(key=>{
            gradeInfo[key] == null ?  gradeInfo[key] = '' : '';
          });
          // editGradeInfoFormList.forEach(item=>{
          //   if (item.name == 'headTeacherId'){
          //     item.options = [{key:gradeInfo.headTeacherId,label:gradeInfo.teacherName}];
          //   }
          // });
          setClassInfo({id,...gradeInfo});
          console.log({id,...gradeInfo});
          setFormListType(editGradeInfoFormList);
        }
      });
      getClassList({gradeId:id}).then(res=>{
        if (res.data){
          if (res.data.list && res.data.list.length > 0){
            setClassList(res.data.list);
          }else{
            setClassList([]);
          }
        }
      });
    }
  };

  //选择不同班级时
  const handelClickClass = (id:any, code:any) => {
    setCurrentClass(id);
    setClassCode(code);
    console.log(code);
    setFormType('class');
    if (id){
      setIsClickAdd(false);
      getClassDetail({id}).then(res=>{
        if (!res.data) return;
        const {personResultDtos:studentList,...classInfo} = res.data.classInfo;
        const personCount = classInfo.boyCount + classInfo.girlCount;
        const currentClassInfo = classList.filter(item=> item.id == id);
        Object.keys(classInfo).forEach(key=>{
          classInfo[key] == null ?  classInfo[key] = '' : '';
        });
        setStudentList(studentList);
        setFormListType(editClassInfoFormList);
        setClassInfo({
          personCount,
          ...classInfo,
          id,
          sort:currentClassInfo[0].sort
        });
      });
    }
    //新增
    else {
      setIsClickAdd(true);
      setStudentList([]);
      setClassInfo({});
      //加个延时，数据改变组件重新渲染需要时间
      setTimeout(()=>{
        baseForm.current.resetFields();
        setFormListType(addClassInfoFormList);
        },10);
    }
  };

  //班级复选框状态改变时
  const changeCheckbox = (value:any) => {
    setCheckboxClassIds(value);
    console.log('value',value);
  };

  //删除班级模态框--点击删除
  const handleDelClassItem = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const classIds = checkboxClassIds.join().split(',');

    classIds.length > 0 ? delClass({classIds}).then(res=>{
      if (res.data == true){
        getClassList({gradeId:currentGrade}).then(res=> {
          if(res.data.list && res.data.list.length > 0){
            setClassList(res.data.list);
            setCurrentClass(res.data.list[0].id);
          }else {
            setClassList([]);
            setCurrentClass('');
          }
        })
      }
    }) : '';
    handleCancelModal();
  };

  //删除班级模态框--点击删除/取消
  const handleCancelModal = () => {
    setDelClassModalVisible(false);
    setShowCheckbox(false);

    //清空复选框
    setShowCheckbox(false);
    setCheckboxClassIds([]);
    setDelClassModalVisible(false);
  };


  const handleClickAddBtn = (isClick:boolean) => {
    setIsClickAdd(isClick);
    baseForm.current.resetFields();
  };

  const handleUpgrade = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    upgrade().then(res=>{
      if (res.data){
        getGradeList({departmentId}).then(res1 => {
          if (res1.data.list && res1.data.list.length > 0){
            const gList = res1.data.list.map(item=>{
              const {id:key, name:label} = item;
              return {key, label};
            });
            setGradeList(gList);
          }else {
            setGradeList([]);
          }
        });
      }
    });
    setUpgradeModalVisible(false);
  };

  //刷新 级部/年级/班级列表
  const refreshList = (result:string) => {
    const type = result.substring(2,4);

    switch (type) {
      case '班级':
        handleClickGrade(currentGrade);
        break;
      case '年级':
        handleClickDepartment(departmentId);
        break;
      case '级部':
        getDepartment({campusId}).then(res=>{
          if (!res.data) return;
          if (res.data.list && res.data.list.length > 0){
            const dList = res.data.list.map(item=>{
              const {id:key, name:label,sort} = item;
              if (key == departmentId){
                setClassInfo({ name:label, id:key,sort });
              }
              return {key, label};
            });
            setDepartmentList(dList);
          }
        })
    }
    baseForm.current.resetFields();
  };

  const classInfoProps = {
    classInfo,
    gradeId:currentGrade,
    departmentId:departmentId,
    classId:currentClass,
    formList: formListType,
    formType,
    isClickAdd,
    baseForm,
    campusId,
    callback:refreshList,
    handleClickAddBtn
  };

  const studentListProps = {
    studentList,
    isClickAdd,
    formType,
    classCode,
    callback:()=>handelClickClass(currentClass,classCode)
  };


  return (
    <div className='custom-main-content'>
      <div className={styles.classDetail}>
      <div className={styles.button}>
        <div style={{marginRight:10}} className={styles.goBack} onClick={()=>{setUpgradeModalVisible(true)}}>升级</div>
        <div className={styles.goBack} onClick={ () => {history.back()}}>返回</div>
      </div>
      <div className={styles.classOperation}>
        <div className={styles.left}>
          {
            (departmentList || []).map((item:any,index)=>{
              return(
                <div
                  key={item.id || index}
                  className={departmentId == item.key ? styles.activeItem : styles.item}
                  onClick={()=>{
                    handleClickDepartment(item.key);
                  }}
                >
                  {item.label}
                </div>
              )
            })
          }
          <div className={departmentId == '' ? styles.activeItem : styles.item}
               style={{cursor:'pointer'}}
               onClick={() => {
                 handleClickDepartment('');
               }}
          >+</div>
        </div>
        <div className={styles.right}>
          <div className={styles.gradeList}>
            {
              (gradeList || []).map((item:any,index) => {
                return (
                  <div
                    onClick={() => {
                      handleClickGrade(item.key);
                    }}
                    className={currentGrade == item.key ? styles.currentGrade : styles.gradeItem}
                    key={index}
                  >
                    {item.label}
                  </div>
                )
              })
            }
            <div className={styles.addGradeButton} onClick={() => {handleClickGrade('')}}>+</div>
            <div className={styles.tips}>(提示:请按照低年级到高年级的顺序排列)</div>
          </div>
          <div className={styles.classList}>
            <Checkbox.Group className={styles.classCheckbox} onChange={(value)=>changeCheckbox(value)} value={checkboxClassIds}>
              {
                (classList || []).map((item:any,index) => {
                  return(
                    <div
                      key={item.id}
                      className={currentClass == item.id ? styles.currentClass : styles.classItem}
                    >
                      <img onClick={() => {handelClickClass(item.id,item.code);}} style={{borderRadius:'5px'}}
                           src={currentClass == item.id ? currentClassImg : classImg}/>
                      {item.name}
                      <Checkbox value={item.id} style={showCheckbox ? {display:'inline-block'} : {display:'none'}}></Checkbox>
                    </div>
                  )
                })
              }
            </Checkbox.Group>
            <div className={styles.addClassButton} onClick={() => {
              handelClickClass('','');
            }}>+</div>
            <img
              src={delImg}
              alt='删除'
              style={!showCheckbox ? {display:'inline-block'} : {display:'none'}}
              className={styles.delClassItemImg}
              onClick={()=>setShowCheckbox(true)}
            />
            <div
              style={showCheckbox ? {display:'inline-block'} : {display:'none'}}
              className={styles.delClassItemButton}
              onClick={()=>{setDelClassModalVisible(true)}}
            >
              删除
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <ClassInfo {...classInfoProps}/>
        <StudentList {...studentListProps}/>
      </div>

      {/*删除班级模态框*/}
        <Modal
        className='customModal'
        visible={delClassModalVisible}
        onOk={()=>handleDelClassItem()}
        onCancel={() => handleCancelModal()}
        okText='删除'
        cancelText='取消'
        closable={false}
        width={600}
      >
        <p style={{fontSize:24,margin:0,color:'#fff'}}>确认删除选中的班级信息吗?</p>
        <p style={{fontSize:16,margin:0,color:'#c10000'}}>删除后班级内的学生信息需要重新绑定班级，请谨慎操作!</p>
      </Modal>

      {/*年级升级模态框*/}
      <Modal
        className='customModal'
        visible={upgradeModalVisible}
        onOk={()=>handleUpgrade()}
        onCancel={()=>{setUpgradeModalVisible(false)}}
        okText='升级'
        cancelText='取消'
        closable={false}
        width={600}
      >
        <p style={{fontSize:24,margin:0,color:'rgb(56,220,255)'}}>确定要对所有班级进行升级操作吗？</p>
        <p style={{fontSize:14,margin:0,color:'rgb(156,156,156)'}}>例：'三年级二班'升级为'四年级二班',(升级顺序按年级排列顺序进行升级)</p>
        <p style={{fontSize:16,margin:0,color:'rgb(230,0,0)'}}>升级后最高排序的毕业班学院将从系统中删除，请谨慎操作!</p>
      </Modal>
    </div>
    </div>
  );
};
