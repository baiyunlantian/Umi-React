/*
  created by jsq on 2020/03/10
  文本框和输入框的切换组件
*/
import React, { useState } from 'react';
import { Input } from 'antd';

export default (props: {
  id: string; // 该组件的id
  text: string; // 默认显示的文字
  style: string; // 组件的样式
  complete?: Function; // 按确认键或者onBlur之后调用的方法
  cancel?: Function; // 如果名字为空调用的方法
}) => {
  const { id, text, style, complete, cancel } = props;
  const [isText, setIsText] = useState(true);

  const handleComplete = (event: React.FormEvent<HTMLInputElement>) => {
    setIsText(true);
    if (event.currentTarget.value) {
      complete && complete(id, event.currentTarget.value);
    } else {
      cancel && cancel();
    }
  };

  const textEle = (
    <div
      className={style}
      onDoubleClick={() => {
        setIsText(false);
      }}
    >
      {text}
    </div>
  );

  const inputEle = (
    <Input
      className={style}
      defaultValue={text}
      onPressEnter={handleComplete}
      onBlur={handleComplete}
    />
  );

  return isText ? textEle : inputEle;
};
