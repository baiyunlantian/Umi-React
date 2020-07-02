import React, { useEffect, useState, useRef } from 'react';
import {getStudentDetailInfo} from '@/services/person';
import {batchDeleteStudent} from '@/services/class';
import StudentInfoModal from './studentInfoModal';
import StudentRepository from './studentRepository';
import delImg from '@/assets/exception-query/del.png';
import addImg from '@/assets/scene/add.png';
import style from '../detail.less';
import { Checkbox, Modal,Radio, message } from 'antd';
import styles from '@/pages/class-management/detail.less';



export default ({studentList,isClickAdd,formType,classCode,callback}) => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));

  const baseForm = useRef();
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [studentRepositoryModalVisible, setStudentRepositoryModalVisible] = useState(false);
  const [addStudentWay, setAddStudentWay] = useState(false);
  const [record,setRecord] = useState({});
  const [modalOkText, setModalOkText] = useState('保存');
  const [modalCancelText, setModalCancelText] = useState('取消');
  const [studentModalTitle, setStudentModalTitle] = useState('学生详细信息');
  const [isAddNewStudent, setIsAddNewStudent] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);                  //控制复选框显示/隐藏
  const [checkboxStudentIds, setCheckboxStudentIds] = useState([]);             //选择删除的学生id
  const [delStudentModalVisible, setDelStudentModalVisible] = useState(false);             //确认删除学生信息模态框
  const [delStudentWay, setDelStudentWay] = useState('');             //删除学生方式

  //查看学生详情信息
  const showStudentDetail = (personId:string , studentModalVisible:boolean) => {
    getStudentDetailInfo({personId}).then(res=>{
      if (res.data) formatPersonData(res.data.studentInfo,studentModalVisible);
    });
    setModalCancelText('保存');
    setModalCancelText('关闭');
    setStudentModalTitle('学生详情信息');
  };

  const handleAddStudent = () => {
    if (isClickAdd){
      message.error('请先添加班级');
    }else {
      setAddStudentWay(true);
    }
  };

  const handleStudentInfoModalVisible = (visible:boolean) => {
    setStudentModalVisible(visible);
    console.log(visible);
    if (visible == false){
      setRecord({});
    }
  };

  const handleStudentRepositoryModalVisible = (visible:boolean) => {
    setStudentRepositoryModalVisible(visible);
  };

  const handleModalOkText = (text:string) => {
    setModalOkText(text);
  };

  const handleModalCancelText = (text:string) => {
    setModalCancelText(text);
  };

  const handleSetIsAddNewStudent = (boolean:boolean) => {
    setIsAddNewStudent(boolean);
  };

  //班级人员列表--学生复选框状态改变时
  const changeCheckbox = (value:any) => {
    setCheckboxStudentIds(value);
    console.log('value',value);
  };

  //点击删除学生个人信息图标时
  const handleDelStudentImg = () => {
    setShowCheckbox(true);
  };

  //删除学生信息模态框--删除按钮
  const handleDelStudent = () => {
    console.log('删除学生',checkboxStudentIds);
    const studentList = JSON.parse(JSON.stringify(checkboxStudentIds));
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    batchDeleteStudent({studentList,classCode:Number(classCode),state:delStudentWay}).then(res=>{
      callback();
      handleCancelModal();
    });
  };

  //取消删除学生信息
  const handleCancelModal = () => {
    setCheckboxStudentIds([]);
    setShowCheckbox(false);
    setDelStudentModalVisible(false);
  };


  const notAdd = () => {
    setStudentModalTitle('添加学生-新增学生信息');
    setIsAddNewStudent(true);
    setAddStudentWay(false);
    setModalOkText('添加');
    setRecord({});
    setStudentModalVisible(true);
    //加个延时，数据改变组件重新渲染需要时间
    setTimeout(()=>{baseForm.current.resetFields();},10);
  };

  //格式化人员数据
  const formatPersonData = (personData:object, visible:boolean) => {
    let data = personData;
    Object.keys(data).forEach(key=>{ data[key] == null ? data[key] = ' ' : ''});
    if (data.parent){
      if (data.parent.indexOf(',') > 0){
        const array = data.parent.split(',');
        const parent1 = array[0].split('|');
        const parent2 = array[1].split('|');

        data.parentId1 = parent1[0];
        data.parentName1 = parent1[1];
        data.relation1 = parent1[2];
        data.parentPhone1 = parent1[3];
        // data.parentWeChat1 = parent1[4];   暂时不用微信号
        data.parentUrl1 = parent1[5];
        data.parentNum1 = parent1[6];

        data.parentId2 = parent2[0];
        data.parentName2 = parent2[1];
        data.relation2 = parent2[2];
        data.parentPhone2 = parent2[3];
        // data.parentWeChat2 = parent2[4];
        data.parentUrl2 = parent2[5];
        data.parentNum2 = parent2[6];
      }else {
        const parent1 = data.parent.split('|');

        data.parentId1 = parent1[0];
        data.parentName1 = parent1[1];
        data.relation1 = parent1[2];
        data.parentPhone1 = parent1[3];
        // data.parentWeChat1 = parent1[4];
        data.parentUrl1 = parent1[5];
        data.parentNum1 = parent1[6];
      }

      delete data.parent;
    }

    setRecord(data);
    setStudentModalVisible(visible);
  };

  const studentModalProps = {
    callback,
    classCode,
    baseForm,
    studentModalVisible,
    record,
    modalOkText,
    modalCancelText,
    studentModalTitle,
    isAddNewStudent,
    handleSetIsAddNewStudent,
    handleModalOkText,
    handleModalCancelText,
    handleStudentInfoModalVisible,
  };

  const studentRepository = {
    handleStudentRepositoryModalVisible,
    showStudentDetail,
    classCode,
    callback,
  }


  return (
    <div className={style.studentList}>
      <div className={style.studentTop}>
        <div>班级人员列表</div>
        <div
          style={showCheckbox ? {display:'inline-block'} : {display:'none'}}
          className={style.delStudentBtn}
          onClick={()=>setDelStudentModalVisible(true)}
        >
          删除
        </div>
        <img
          style={!showCheckbox ? {display:'inline-block'} : {display:'none'}}
          src={delImg} alt='del'
          onClick={()=>handleDelStudentImg()}
        />
      </div>
      {!studentRepositoryModalVisible ? (<div className={style.list}>
        <Checkbox.Group className={styles.studentCheckbox} onChange={(value)=>changeCheckbox(value)} value={checkboxStudentIds}>
          <div className={style.addClassButton}>
            { formType == 'class' ? <img src={addImg} className={style.studentImg} onClick={handleAddStudent} /> :''}
            <div></div>
          </div>
        {
          (studentList || []).map((item,index) => {
            return (
              <div
                className={style.studentItem}
                key={index}
                onClick={() => !showCheckbox ? showStudentDetail(item.id,true) : ''}
              >
                <div className={style.studentImg}>
                  <img src={item.url} alt='***'/>
                </div>
                <div className={style.studentText}>{item.code} {item.name}</div>
                <Checkbox
                  value={item.id}
                  style={showCheckbox ? {display:'inline-block'} : {display:'none'}}
                />
              </div>
            )
          })
        }
        </Checkbox.Group>
      </div>)
      :
      /*从人员库中添加学生*/
      (<StudentRepository {...studentRepository}/>)}

      { studentModalVisible == true ? <StudentInfoModal {...studentModalProps}/> : ''}



      <Modal
        title='请选择添加方式'
        className='addWayModal'
        visible={addStudentWay}
        okText='新增学生信息'
        cancelText='人员库添加'
        onCancel={()=>setAddStudentWay(false)}
        width={600}
      >
        <div className='addStudentWay'>
          <button className='ant-btn' onClick={notAdd}>新增学生信息</button>
          <span>(从当前人员库中添加的学生)</span>
        </div>
        <div className='addStudentWay'>
          <button
            className='ant-btn-primary'
            onClick={()=>{handleStudentRepositoryModalVisible(true); setAddStudentWay(false);}}
          >人员库添加</button>
          <span>(从人员库中未绑定班级的学生中添加)</span>
        </div>
      </Modal>

      <Modal
        className='delStudentItemModal'
        visible={delStudentModalVisible}
        onOk={()=>handleDelStudent()}
        onCancel={() => handleCancelModal()}
        okText='删除'
        cancelText='取消'
        closable={false}
        width={600}
      >
        <p style={{fontSize:24,margin:0,color:'#f00'}}>确认删除选中的学生信息吗?</p>
        <Radio.Group onChange={(e)=>{setDelStudentWay(e.target.value)}}>
          <Radio value='0' className={delStudentWay == '0' ? 'active-del-way' : ''}>
            仅在当前班级删除
            <div className='delTips'>(只解除班级信息，删除后学生不会从系统中删除)</div>
          </Radio>
          <Radio value='1' className={delStudentWay == '1' ? 'active-del-way' : ''}>
            在人员库中删除
            <div className='delTips'>(删除学生所有信息，并从系统中删除)</div>
          </Radio>
        </Radio.Group>
      </Modal>
    </div>
  )
};
