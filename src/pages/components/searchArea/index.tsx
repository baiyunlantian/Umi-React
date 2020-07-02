import React, { forwardRef, useImperativeHandle } from 'react';
import { connect } from 'dva';
import {
  Icon,
  Tooltip,
  Form,
  Input,
  Select,
  Col,
  Button,
  DatePicker,
  Radio
} from 'antd';
import style from './index.less';
import { color } from 'echarts/src/export';

const { RangePicker } = DatePicker;

const SearchArea = (
  { searchForm, handleSearch, children, customChildren, initialValues },
  ref,
) => {
  const [form] = Form.useForm();
  const tips = {
    input: '输入',
    select: '选择',
    date: '选择',
  };
  const handleSubmit = values => {
    handleSearch(values);
  };
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
  const reset = () => {
    form.resetFields();
  };
  const {Option} = Select;

  const getFormItem = ({ type, label, name , options=[],onChange,filterOption,onSearch,showSearch}) => {
    if (type === 'range-picker') {
      return (
        <RangePicker
          placeholder=""
          format="YYYY/MM/DD"
          className={style.rangePicker}
          dropdownClassName={style.rangePickerDropdown}
          onChange={onChange ? (dates,dateStrings)=>onChange(dates,dateStrings) : ()=>{}}
        />
      );
    } else if(type === 'select'){
      return (
        <Select
          placeholder="请选择"
          showArrow={true}
          allowClear={true}
          filterOption={filterOption}
          showSearch={showSearch}
          onSearch={onSearch instanceof Function ? onSearch : ''}
          onChange={onChange && onChange instanceof Function ? onChange : ()=>{}}
        >
          {
            options.map(item => {
              return (
                <Option vlaue={item.key} key={item.key}>{item.label}</Option>
              )
            })
          }
        </Select>
      )
    } else if( type === 'radio') {
      return (
        <Radio.Group name="radiogroup">
          {options.map(item => (
            <Radio value={item.key} key={item.key}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      );
    }
    else {
      return (
        <Input
          placeholder={`请${tips[type] || '输入'}`}
          className={style.searchInput}
        />
      );
    }
  };

  useImperativeHandle(ref, () => ({
    ...form,
  }));

  return (
    <Form
      form={form}
      className={style.searchArea}
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <div className={style.searchForm}>
        {searchForm.map(field => (
          <Form.Item
            className={style.antFormItem}
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[
              {
                required: field.isRequired,
                message: `请${tips[field.type] || '输入'}${field.label}！`,
              },
            ]}
            {...formItemLayout}
          >
            {getFormItem(field)}
          </Form.Item>
        ))}
      </div>
      <div className={style.button}>
        {customChildren ? (
          children
        ) : (
          <div className={style.boxBtn}>
            <Button htmlType="submit">
              查询
            </Button>
            {children || <Button onClick={reset}>重置</Button>}
          </div>
        )}
      </div>
    </Form>
  );
};

export default connect(() => {}, null, null, { forwardRef: true })(
  forwardRef(SearchArea),
);
