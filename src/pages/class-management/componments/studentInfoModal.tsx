import React, { useEffect, useState, useRef } from 'react';
import BaseForm from '@/pages/components/base-form';
import { Button, message, Modal } from 'antd';
import Upload1 from '@/pages/components/upload';
import editImg from '@/assets/exception-query/edit.png';
import { insertPerson, updatePerson } from '@/services/person';
import { dynamic, useModel } from 'umi';
import { selectClassFuzzyDownList,getClassDetail } from '@/services/class';
import BatchImport from '@/pages/components/batchImport';
import { person } from '@/services/config';
import ImportImg from '@/assets/person_picture/export.png';
import styles from '@/pages/person-management/index.less';

const Upload = dynamic({
  loader: async function () {
    const { default: Upload } = await import('rc-upload');
    return Upload;
  },
});


export default (
  {
    callback,
    classCode,
    baseForm,
    record,
    modalOkText,
    modalCancelText,
    studentModalTitle,
    studentModalVisible,
    isAddNewStudent,
    handleModalOkText,
    handleModalCancelText,
    handleSetIsAddNewStudent,
    handleStudentInfoModalVisible,
  }) => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const currentCampus = JSON.parse(window.localStorage.getItem('currentCampus'));
  let schoolId = '';
  let campusId = '';

  if (campus){
    schoolId = campus.schoolId;
  }
  if (currentCampus){
    campusId = currentCampus.campusId;
  }

  const [imgUrl1, setImgUrl1] = useState<string>(record.url);
  const [imgUrl2, setImgUrl2] = useState<string>(record.parentUrl1);
  const [imgUrl3, setImgUrl3] = useState<string>(record.parentUrl2);
  const [file1, setFile1] = useState<any>();
  const [file2, setFile2] = useState<any>();
  const [file3, setFile3] = useState<any>();
  const [isClickEditImg, setIsClickEditImg] = useState<boolean>(false);
  const [filterClassList, setFilterClassList] = useState([]);
  const [dormitoryList, setDormitoryList] = useState([]);
  const [isBoarder, setIsBoarder] = useState(0);
  const [errInfoList, setErrInfoList] = useState([]);
  const [errVisible, setErrVisible] = useState(false);
  const { getDormitory } = useModel('dormitory');
  useEffect(() => {
    getDormitory().then(list => {
      studentBoarderFormList.forEach(item=>{
        if (item.name === 'dormitoryCode'){
          item.options = list;
          setDormitoryList(list);
          return;
        }
      })
    });

    console.log(record);
    if (record.classCode){
      studentNotBoarderFormList.forEach(item=>{
        if (item.name == 'classCode'){
          item.options = [{key:record.classCode, label:record.className}];
        }
      });

      studentBoarderFormList.forEach(item=>{
        if (item.name == 'classCode'){
          item.options = [{key:record.classCode, label:record.className}];
        }
      });
    }
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs:{span: 24 },
      sm:{span: 16 }
    }
  };

  //判断学生信息模态框是否禁用
  const handleModalIsDisabled = () => {
    if (isAddNewStudent){
      return false;
    }else if (isClickEditImg){
      return false;
    }

    return true;
  };

  const filterClass = (value:string) => {
    if (value.length >= 2){
      selectClassFuzzyDownList({className:value}).then(res=>{
        if (res.data){
          const list = res.data.map(item=>{
            const {classCode:key, className, gradeName, departmentName} = item;
            return {key, label:departmentName+gradeName+className};
          });

          if (isBoarder == 1){
            studentBoarderFormList.forEach(item=>item.name == 'classCode' ?  item.options = list : '');
          }else {
            studentNotBoarderFormList.forEach(item=>item.name == 'classCode' ?  item.options = list : '');
          }

          setFilterClassList(list);
        }
      });
    }
  };

  //选择学生是否住宿
  const selectBoarder = (boarder:any) => {
    setIsBoarder(boarder);
    boarder == 1 ? setFormList(studentBoarderFormList) : setFormList(studentNotBoarderFormList);
  };

  //选择学生--住校
  const studentBoarderFormList = [
    { name: 'name', label: '姓名', type: 'input',required:true },
    {
      name: 'sex',
      label: '性别',
      type: 'radio',
      options:[
        {key:'1',label:'男'},
        {key:'0',label:'女'},
      ],
      required:true
    },
    { name: 'ipNum', label: '身份证号', type: 'input',required:true },
    { name: 'phone', label: '手机号', type: 'input',required:true },
    {
      name:'roleId',
      label:'角色',
      type:'select',
      options:[
        {key:1,label: '学生'},
      ],
      required:true
    },
    {
      name:'classCode',
      label:'所在班级',
      type:'select',
      options:filterClassList,
      filterOption:true,
      onSearch:filterClass,
      showSearch:true
    },
    {name:'code',label:'学号',type:'input',required:true},
    {
      name:'type',
      label:'是否住校',
      type:'select',
      options:[
        {key:1,label: '是'},
        {key:0,label: '否'},
      ],
      onChange:selectBoarder,
      required:true
    },
    {
      name:'dormitoryCode',
      label:'宿舍',
      type:'select',
      options: dormitoryList,
      required:true
    },
    { name:'parentName1', label:'监护人1', type:'input', required:true },
    { name:'relation1',label:'关系',type:'input', required:true},
    {name:'parentPhone1',label:'手机号',type:'input', required:true},
    {name:'parentName2',label:'监护人2',type:'input'},
    {name:'relation2',label:'关系',type:'input'},
    {name:'parentPhone2',label:'手机号',type:'input'},
    { name: 'remark', label: '备注', type: 'input', className: 'textarea'},
  ];

  //选择学生--非住校
  const studentNotBoarderFormList =  [
    { name: 'name', label: '姓名', type: 'input',required:true },
    {
      name: 'sex',
      label: '性别',
      type: 'radio',
      options:[
        {key:'1',label:'男'},
        {key:'0',label:'女'},
      ],
      required:true
    },
    { name: 'ipNum', label: '身份证号', type: 'input',required:true },
    { name: 'phone', label: '手机号', type: 'input',required:true },
    {
      name:'roleId',
      label:'角色',
      type:'select',
      options:[
        {key:1,label: '学生'},
      ],
      required:true
    },
    {
      name:'classCode',
      label:'所在班级',
      type:'select',
      options:filterClassList,
      filterOption:true,
      onSearch:filterClass,
      showSearch:true,
      required:true
    },
    {name:'code',label:'学号',type:'input',required:true},
    {
      name:'type',
      label:'是否住校',
      type:'select',
      options:[
        {key:1,label: '是'},
        {key:0,label: '否'},
      ],
      onChange:selectBoarder,
      required:true
    },
    { name:'parentName1', label:'监护人1', type:'input', required:true },
    { name:'relation1',label:'关系',type:'input', required:true},
    {name:'parentPhone1',label:'手机号',type:'input', required:true},
    {name:'parentName2',label:'监护人2',type:'input'},
    {name:'relation2',label:'关系',type:'input'},
    {name:'parentPhone2',label:'手机号',type:'input'},
    { name: 'remark', label: '备注', type: 'input', className: 'textarea'},
  ];

  const [formList, setFormList] = useState(record.type == 0 ? studentNotBoarderFormList : studentBoarderFormList);

  const formProps = {
    hiddenFooter: true,
    initialValues:record,
    formList,
  };

  const onOk = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = baseForm.current.getFormValues();
    const validValues = validData(values);
    if (!validValues) return;
    const formData = new FormData();
    Object.keys(values).forEach(key => values[key] ? formData.append(key, values[key]) : '');
    formData.append('campusId', campusId);
    formData.append('schoolId', schoolId);
    file1 ? formData.append('file1', file1) : '';

    if (imgUrl2 && imgUrl2.length > 0){
      file2 ? formData.append('file2', file2) : '';
    }
    if (imgUrl3 && imgUrl3.length > 0){
      file3 ? formData.append('file3', file3) : '';
    }

    // 新增角色
    if (isAddNewStudent){
      insertPerson(formData).then(res=>{
        if (res.data) {
          resetImgUrl();
          message.success('新增成功',2);
          callback();
        };
      });
    }
    //更新角色
    else if (isClickEditImg){
      const {personId, parentId1,parentId2} = record;
      formData.append('personId', personId);
      parentId1 ? formData.append('parentId1', parentId1) : '';
      parentId2 ? formData.append('parentId2', parentId2) : '';
      updatePerson(formData).then(res=>{
        if (res.data){
          resetImgUrl();
          message.success('更新成功',2);
          callback();
        };
      });
    }
    clickCancelBtn();
  };

  const validData = (data:object) => {

    if (!(data.name && data.ipNum && data.phone && data.roleId && (data.sex == 0 || data.sex == 1))){
      message.error('缺少必填信息',2);
      return false;
    }

    if (!(imgUrl1 && imgUrl1.length > 0)){
      message.error('请上传头像',2);
      return false;
    }

    //判断学生
    if (data.roleId == 1){
      if (data.classCode == '' || data.classCode == ' ' || data.classCode == null || data.classCode == undefined){
        message.error('缺少班级信息',2);
        return false;
      }
      if (!data.code){
        message.error('学号必填',2);
        return false;
      }
      if (data.type == '' || data.type == ' ' || data.type == null || data.type == undefined){
        message.error('是否住校必填',2);
        return false;
      }
      if (data.type == 1){
        if (data.dormitoryCode == '' || data.dormitoryCode == ' ' || data.dormitoryCode == null || data.dormitoryCode == undefined){
          message.error('缺少宿舍信息',2);
          return false;
        }
      }
      if (!(data.parentName1 && data.relation1 && data.parentPhone1)){
        message.error('监护人1信息不完整',2);
        return false;
      }
      if (!(imgUrl2 && imgUrl2.length > 0)){
        message.error('缺少监护人1头像',2);
        return false;
      }
    }

    return true;
  };

  const resetImgUrl = () => {
    setImgUrl1('');
    setImgUrl2('');
    setImgUrl3('');
  };

  //点击模态框取消操作
  const clickCancelBtn = () => {
    resetImgUrl();
    handleStudentInfoModalVisible(false);
    setIsClickEditImg(false);
    handleSetIsAddNewStudent(false);
  };

  const uploadOption1 = {
    name: 'logo1',
    accept: 'image/*',
    headers: {
      token: localStorage.getItem('token'),
    },
    fileList: [],
    setImageUrl: (url,file) => {
      setImgUrl1(url);
      setFile1(file);
    },
  };

  const uploadOption2 = {
    name: 'logo2',
    accept: 'image/*',
    headers: {
      token: localStorage.getItem('token'),
    },
    fileList: [],
    setImageUrl: (url,file) => {
      setImgUrl2(url);
      setFile2(file);
    },

  };

  const uploadOption3 = {
    name: 'logo3',
    accept: 'image/*',
    headers: {
      token: localStorage.getItem('token'),
    },
    fileList: [],
    setImageUrl: (url,file) => {
      setImgUrl3(url);
      setFile3(file);
    },
  };

  const batchImportProps = {
    action:`${person}/excel/importPerson`,
    name: 'file',
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    headers: {
      token: localStorage.getItem('token'),
    },
    data:{
      schoolId,
      campusId
    },
    onSuccess:(res) => {
      const errList = [];
      const {studentFailList, teacherFailList, workerFailList} = res.data;

      (studentFailList || []).map(item=>{errList.push(item)});
      (teacherFailList || []).map(item=>{errList.push(item)});
      (workerFailList || []).map(item=>{errList.push(item)});

      setErrInfoList(errList);
      setErrVisible(true);
    },
    onError:(res) => {
      message.error('导入失败');
    }
  };

  return (
    <Modal
      title={studentModalTitle}
      className={modalCancelText === '关闭' ? 'studentDetailModal' : 'studentDetailModal editing'}
      visible={studentModalVisible}
      onOk={onOk}
      onCancel={clickCancelBtn}
      okText={modalOkText}
      cancelText={modalCancelText}
      okType={modalOkText === '保存' ? 'primary' : 'default'}
      closable={false}
    >
      {isAddNewStudent ? campus.campusId == null ? '' :
        <Upload {...batchImportProps}>
        <img src={ImportImg}/>
      </Upload> : ''}
      <div className='masker-layout' style={handleModalIsDisabled() == true ? {visibility:'visible',cursor: 'not-allowed'} : {visibility:'hidden'}}></div>
      <div className='updateBox'>
        <div className='leftUpdate'>
          <div className='studentUpload'>
            <div className={imgUrl1 ? 'Upload' : 'watermark'}>
              <img
                width="100%"
                height="100%"
                src={imgUrl1}
                alt=""
                draggable={false}
              />
            </div>
            <Upload1 {...uploadOption1}>
              <Button className='btnUpload'>上传照片</Button>
              <p className='tips'>（请上传本人正面头像照片）</p>
            </Upload1>
          </div>
          <div className='guardianUpload'>
            <div className='guardianItem'>
              <div className={imgUrl2 ? 'Upload' : 'watermark'}>
                <img
                  width="100%"
                  height="100%"
                  src={imgUrl2}
                  alt=""
                  draggable={false}
                />
              </div>
              <Upload1 {...uploadOption2}>
                <Button className='btnUpload'>上传照片</Button>
                <p className='tips'>（监护人1）</p>
              </Upload1>
            </div>
            <div className='guardianItem'>
              <div className={imgUrl3 ? 'Upload' : 'watermark'}>
                <img
                  width="100%"
                  height="100%"
                  src={imgUrl3}
                  alt=""
                  draggable={false}
                />
              </div>
              <Upload1 {...uploadOption3}>
                <Button className='btnUpload'>上传照片</Button>
                <p className='tips'>（监护人2）</p>
              </Upload1>
            </div>
          </div>
        </div>
        <div className='rightForm'>
          <BaseForm
            ref={baseForm}
            formItemLayout={formItemLayout}
            {...formProps}
          />
        </div>
      </div>

      { isAddNewStudent
        ? ''
        :  <img
          src={editImg}
          alt='编辑'
          className='editImg'
          onClick={() => {
            setIsClickEditImg(true);
            handleModalCancelText('取消');
            handleModalOkText('保存');
            handleSetIsAddNewStudent(false);
          }}/>
      }
      <Modal
        title='错误信息列表'
        className={styles.errModal}
        visible={errVisible}
        okText='确认'
        cancelText='关闭'
        onCancel={() => {setErrVisible(false)}}
        onOk={() => {setErrVisible(false)}}
        closable={false}
      >
        {
          errInfoList.length > 0
            ?
            (errInfoList || []).map((item,index)=>{
              return(
                <span className={styles.errItem} key={index}>{item}</span>
              )
            })
            :
            <span>上传成功</span>
        }
      </Modal>
    </Modal>
  )
};
