
/**
 * 上传预览, 调用onUpload上传 */

import { Upload, message, Spin } from 'antd';
import React, { useState } from 'react';
const { Dragger } = Upload;

let fileList:Array<File>;
let uploadFile:File;
export const onUpload = (url:string, param: any, onSuccess:Function,onLineFile?:File) => {
  if (!uploadFile && !onLineFile) {
    message.error('请上传图片!');
    return
  }
  param.file = onLineFile instanceof File? onLineFile : uploadFile;
  const formData = new FormData();
  Object.keys(param).forEach(name => formData.append(name, param[name]));
  fetch(url, {
    method: 'post',
    headers:{
      token: localStorage.getItem('token')!
    },
    body: formData,
  }).then(res => {
    fileList = [];
    if(res.status === 200) {
      message.info('上传成功!');
      onSuccess();
    }else {
      message.error('上传失败!');
    }

  });
}

function getBase64(img:File, callback:Function) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result,img));
  // 开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 data: URL 格式的字符串以表示所读取文件的内容。
  reader.readAsDataURL(img);
}

const CustomUpload = (
    { children, setImageUrl, type,data }
    :{children:JSX.Element, setImageUrl: Function, type?: string, data?: object }
  ) => {

  // 上传的图片改变时更新预览图片
  const handleChange = (info: any) => {
    fileList = [info.file];
  };

  function beforeUpload(file:File) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }
    uploadFile = file;
    getBase64(file, setImageUrl)
    return false;
  }

  const uploadButton = (
    <div>
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  if (type === 'Dragger') {
    return (<Dragger
      fileList={fileList}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {children}
    </Dragger>)
  }
  return (
    <Upload
      fileList={fileList}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {children || uploadButton}
    </Upload>
  );
};

export default CustomUpload;
