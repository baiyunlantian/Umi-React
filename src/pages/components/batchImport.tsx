import React, { useEffect } from 'react';
import { message } from 'antd'
import { useImmer } from 'use-immer';
import {importPerson} from '@/services/person';
import ImportImg from '@/assets/person_picture/export.png';
import { dynamic } from 'umi';
import * as XLSX from 'xlsx'
//const XLSX = async ()=> await import("xlsx");

const Upload = dynamic({
  loader: async function() {
    const { default: Upload } = await import( 'rc-upload');
    return Upload;
  },
});

export default ({success,failed}) => {

  const [{sheetData, imageMap, sheetConfig},setState] = useImmer<any>({
    imageMap: new Map(),
    sheetData: [],
    sheetConfig:{
      ['姓名']: 'name',
      ['性別']: 'sex',
      ['身份证号']: 'ipNum',
      ['手机号']: 'phone',
      ['图片']: 'baseFile',
      ['微信号']: 'weChat',
      ['备注']: 'remark',
      ['工号']: 'code',
      ['学号']: 'code',
      ['岗位']: 'stationName',
      ['所属班级代号']: 'classId',
      ['所属班级名称']: 'classroom',
      ['班级代号']: 'classId',
      ['班级名称']: 'classroom',
      ['是否住校']: 'type',
      ['监护人1（姓名）']: 'parentName1',
      ['监护人1（手机号）']: 'parentPhone1',
      ['监护人1（微信号）']: 'parentWeChat1',
      ['监护人1（关系）']: 'relation1',
      ['监护人1（图片）']: 'baseParentFile1',
      ['监护人2（姓名）']: 'parentName2',
      ['监护人2（手机号）']: 'parentPhone2',
      ['监护人2（微信号）']: 'parentWeChat2',
      ['监护人2（关系）']: 'relation2',
      ['监护人2（图片）']: 'baseParentFile2',
    }
  });

  useEffect(()=>{
    import("xlsx");
  },[]);
  //解析excel
  function parseExcel(workbook:any){
    if(!workbook)return;
    return workbook.SheetNames.map((sheet:any)=>
      XLSX().utils.sheet_to_json(workbook.Sheets[sheet]).map((item:any)=>{
        const data:any = {};
        Object.keys(item).map(name=>{
          data[sheetConfig[name]] = item[name];
        });
        return data;
      }));
  }

  function getBase64(img:File, callback:Function) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(img);
  }

  async function readWorkbookFromLocalFile(file, callback){
    const reader = new FileReader();   
    return new Promise(resolve => {
      reader.onload =function(e){
        const data = e.target.result;
        const workbook = XLSX().read(data, {type:'binary'});
        if(callback){
          const data = callback(workbook);
          resolve(data)
        }
      };
      reader.readAsBinaryString(file);
    })
  }

  async function beforeUpload(file: File){
    if(file.name.endsWith('.xlsx')){
      let data = await readWorkbookFromLocalFile(file,parseExcel);
      setState((draft:any) => {
        draft.sheetData = data;
      })
    }else if(['jpg','jpeg','png'].includes(file.name.split(".")[1])){
      getBase64(file,(image:string)=>{
        imageMap.set(file.name,image);
        /*setState(draft => {
          draft.imageMap = imageMap;
        })*/
      })
    }else return
  }

  const onSuccess = () => {
    if (sheetData && sheetData.length > 0){
      const [studentList,teacherList,workerList] = dataBindImage();
      const data = {};
      studentList && studentList.length > 0 ? data.studentList = studentList : '';
      teacherList && teacherList.length > 0 ? data.teacherList = teacherList : '';
      workerList && workerList.length > 0 ? data.workerList = workerList : '';
      importPerson(data).then(res=>{
        if (res.data){
          res.data.failList.length > 0 ? failed() : success();
        }
      });
    }
  };


  // 数据绑定图片
  function dataBindImage(){
    let data:any = [];
    data = sheetData.map((itemList:any,index)=>{
      let personList = itemList.map((item:any)=>{
        let temp = {...item};

        Object.keys(temp).forEach(key=>{
          temp[key] == '' || temp[key] == null || temp[key] == undefined ? delete temp[key] : '';

          if (key == 'sex'){
            if (temp.sex.indexOf('男') >= 0){
              temp.sex = 1;
            }else if(temp.sex.indexOf('女') >= 0){
              temp.sex = 0;
            }else{
              message.error('表格数据性别不规范,请输入男/女');
              return ;
            }
          }

          if (index == 0 && key == 'type'){
            if (temp.type.indexOf('是') >= 0){
              temp.type= 1;
            }else if(temp.type.indexOf('否') >= 0){
              temp.type = 0;
            }else{
              message.error('表格学生是否住校不规范,请输入是/否');
            }
          }
        });

        ['baseFile','baseParentFile1','baseParentFile2'].map(f=>{
          if(imageMap.get(temp[f])){
            temp[f] = imageMap.get(temp[f]);
          }
        });
        return temp;
      });
      return personList;
    });
    return data;
  }

  return (
    <div className='exportContainer'>
      <Upload beforeUpload={beforeUpload} onSuccess={onSuccess}  directory>
        <img src={ImportImg}/>
      </Upload>
    </div>
  );
}
