import React, { createElement, ReactElement, useState } from 'react';
import { Row, Col, Input, Select, Radio, DatePicker, Spin, TimePicker,TreeSelect  } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { number } from 'prop-types';
import routes from '@/router';
import moment from 'moment'
import style from '@/pages/components/searchArea/index.less';
import { useModel } from 'umi';

const { TextArea } = Input;
const { Option } = Select;


export const getColSpace = (rowCount: number = 6, index: number): string => {
  let place = '';
  if (index % rowCount === 0) {
    place = 'left';
  } else if (index % rowCount === index) {
    place = 'right';
  } else {
    place = 'left';
  }
  return place;
};

export const renderList = (
  list: Array<any>,
  renderItem: Function,
): Array<any> => {
  const ele: Array<any> = [];
  if (!list || list.length === 0) {
    return ele;
  }
  list.map((item, index) => {
    let content = renderItem(item);
    ele.push(content);
  });

  return ele;
};

export function html(
  a: TemplateStringsArray,
  values: string,
): React.ReactElement {
  const div = createElement('div', {}, <div>12123</div>);
  return div;
}

export const getUrl = (url: string, params: Object = {}) => {
  Object.keys(params).forEach(item => {
    typeof params[item] !== 'undefined' &&
    (url += `${url.includes('?') ? '&' : '?'}${item}=${params[item]}`);
  });
  return url;
};

export const ClearInput=({pwd,value="",disabled, onChange=(value:string)=>{}, placeholder})=>{
  const [type,setType] =useState("txt");
  // const [value,setType] =useState("txt");
  function handleFocus(){
    if(pwd){
      setType("password")
    }
  }
  function handleChange(value:string) {
    // console.log(value)
    onChange(value);
  }

  return (
    <Input
      disabled={disabled}
      value={value}
      onChange={handleChange}
      type={type}
      onFocus={handleFocus}
      placeholder={placeholder}
      style={{ border: '1px solid #a0a0a0' }} />
  )
};


// 获取表单项类型
export const getFormItem = (item: any,disabled: boolean,index?:number,getSelectOptions?:Function): ReactElement => {
  switch (item.type) {
    default:
    case 'input':
      return <ClearInput pwd={item.pwd} placeholder={item.disabled ? '': '请输入'}  disabled={item.hasOwnProperty('disabled') == true ? item.disabled : disabled}/>
    case 'radio': {
      const { options } = item;
      return (
        <Radio.Group disabled={disabled}>
          {options.map((item:any) => (
            <Radio value={item.key} key={item.key}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      );
    }
    case 'textarea': {
      const { options } = item;
      return <TextArea  placeholder={'请添加备注'} disabled={disabled}/>;
    }
    case 'select': {
      const { options,filterOption, showSearch,disabled:cDisabled,onChange,dropdownClassName,onSearch,onSelect } = item;
      return (
        <Select
          placeholder={'请选择'}
          allowClear={true}
          disabled={cDisabled || disabled}
          showSearch={showSearch}
          filterOption={filterOption}
          mode={item.mode ? item.mode : ''}
          dropdownClassName={dropdownClassName}
          onSelect={onSelect && onSelect instanceof Function ? onSelect : ()=>{}}
          onChange={onChange && onChange instanceof Function ? onChange : ()=>{}}
          onSearch={onSearch && onSearch instanceof Function ? onSearch : ()=>{}}
        >
          {
            (options || []).map((option:any) => {
              return (
                <Option key={option.key}>{option.label}</Option>
              )
            })
          }
        </Select>
      );
    }
    case 'tree-select': {
      const {treeData,loadData} = item;
      return (
        <TreeSelect
          placeholder={'请选择'}
          allowClear={true}
          treeDataSimpleMode
          loadData={loadData}
          treeData={treeData}
        />
      );
    }
    case 'datepicker': {
      const { options } = item;
      const { startValue, endValue, endOpen } = this.state;
      return (
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime={false}
          format="YYYY-MM-DD"
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
      );
    }
    case 'range-picker' : {
      const { showTime } = item;
      return (
        <DatePicker.RangePicker
          placeholder=""
          showTime={showTime ? true : false}
          format={showTime ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD"}
          className={style.rangePicker}
          dropdownClassName={style.rangePickerDropdown}
        />
      );
    }
    case 'time-range' : {
      return (
        <TimePicker.RangePicker
          placeholder=""
          format={"HH:mm"}
          className={style.timeRange}
          dropdownClassName={style.rangePickerDropdown}
        />
      );
    }
    case 'time-picker' : {
      return (
        <TimePicker
          placeholder=""
          format={"HH:mm"}
          className={style.timePicker}
          dropdownClassName={style.rangePickerDropdown}
        />
      );
    }
  }
};

// 前端保存文件
export const downloadFileByBlob = (blobContent, filename) => {
  const blobUrl = window.URL.createObjectURL(blobContent);
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  eleLink.href = blobUrl
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
};
