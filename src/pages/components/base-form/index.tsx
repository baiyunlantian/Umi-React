import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Form, Button } from 'antd';
import { getFormItem } from '@/utils/common';
import { useImmer } from 'use-immer';
import moment from 'moment'

const FormItem = Form.Item;
const BaseForm = (
  {
    formList,
    formItemLayout,
    hiddenFooter,
    handleCancel,
    record,
    handleSubmit,
    initialValues,
    className,
    validate,
    disabled,
  }:any,
  ref:any,
) => {

  console.log(initialValues);
  const [form] = Form.useForm();

  const [ { list,},setState]=useImmer({
    list:  formList,
  });

/*  useMemo(()=>{
    setState(draft => {
      draft.list = formList;
    })
  },[ formList]);*/


  const onSubmit =(values:any)  => {
    //handleSubmit(values);
     console.log(values)
  };

  const onCancel = () => {
    form.resetFields();
    // handleCancel();
  };
  useImperativeHandle(ref, () => ({
    getFormValues: () => form.getFieldsValue(),
    ...form,
  }));

  useMemo(() => {
    // initialValues变化时，执行重置表单值
    let values = {...initialValues}
    Object.keys(values).map((key) => {
      values[key] = values[key] + '';
    })
    form.setFieldsValue(values);
  }, [initialValues]);

  const getMessage = (item:any) => {
    if(item.required){
      return item.message ? item.message : ['select','radios','check'].includes(item.type) ? '请选择' :`请输入${item.label}!`
    }
    return ""
  }

  const  handleValuesChange = (changedValues:any,allValues:any) => {
    const changedField = Object.keys(changedValues)[0];
    const changedItemIndex = formList.findIndex((item: any)=>item.name === changedField);
    const changedItem = formList[changedItemIndex];
    changedItem.onChange&&changedItem.onChange(allValues,form);
  }

  return (
    <div>
      <Form form={form} onValuesChange={handleValuesChange} initialValues={initialValues || {}} onFinish={onSubmit}>
        {formList.map((item:any) => (
            <FormItem
              {...formItemLayout}
              className={item.className}
              key={item.name}
              name={item.name}
              label={item.label}
              rules={item.required?[{
                required: true,
                message: item.validator? "" : getMessage(item),
                pattern: item.reg,
                validator: item.validator ? async (rule,value)=>{
                  const message = item.validator(value,form.getFieldsValue());
                  if(message){
                    throw new Error(message)
                  }
                }: undefined
              }]:[]}
              valuePropName={item.valuePropName || 'value'}
              shouldUpdate={(prevValues, curValues) =>
                prevValues.additional !== curValues.additional
              }
            >
              {getFormItem(item,disabled)}
            </FormItem>
        ))}
        {/*<Button htmlType="submit">保存</Button>*/}
        {!hiddenFooter && (
          <div >
            <Button htmlType="submit">保存</Button>
            <Button onClick={onCancel}>
              取消
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default forwardRef(BaseForm);
