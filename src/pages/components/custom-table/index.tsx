import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
} from 'react';
import request from '@/utils/request';
import { Table } from 'antd';
import { CustomTableProps } from './type';
import { useImmer } from 'use-immer';
import { person, mdata } from '@/services/config';
import style from './index.less'

const CustomTable = ({ url, data, pageSize, renderData, params, tableFields = [], dataKey}: CustomTableProps,
  ref,
) => {
  const [param, setParams] = useState(params);
  const [searchParam, setSearchParam] = useState({});
  const onChange =(current: number, size: number) => {
    setState(draft => {
      draft.pagination.current = current;
      draft.pagination.pageSize = size;
    });
    search({ pageNum: current, pageSize: size, ...searchParam });
  }
  const [{ pagination, dataSource, loading }, setState] = useImmer<any>({
    dataSource: [],
    loading: true,
    pagination: {
      current: 1,
      pageSize: pageSize || 10,
      showTotal: (total : number) => `共${total}条`,
      onChange,
    },
  });
  useEffect(() => {
    setState(draft => {
      draft.pagination.onChange = onChange;
    });
  }, [param,searchParam])



  const search = async (searchParams: object, body?: object) => {

    body && setParams(body);
    Object.keys(searchParams).forEach(key=>{
      if (searchParams[key] == null || searchParams[key] == undefined || searchParams[key] === ''){
        delete searchParams[key];
      }
    });
    if (searchParams.hasOwnProperty('pageNum') == false){
      setSearchParam(searchParams)
      setState(draft => {
        draft.pagination.current = 1;
      });
    }else if (JSON.stringify(searchParams) == '{}'){
      setSearchParam({});
    }
    const { data } = await request(url.replace(url.includes('/api/data') ? '/api/data' : '/api',url.includes('/api/data') ? mdata : person), {
      method: 'post',
      data: {
        pageNum: searchParams.hasOwnProperty('pageNum') == false ? 1 : pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
        ...(body || param)
      },
    });
    if(data){
      setState(draft => {
        draft.dataSource = renderData ? renderData(data[dataKey || 'list']) : data[dataKey || 'list'] || [];
        draft.pagination.total = data.page ? data.page.total : 0;
        draft.loading = false;
      });
    }
  };

  useEffect(() => {
    if(data){
      setState(draft => {
        draft.dataSource = data;
        draft.loading = false;
        draft.pagination.total = data.length;
      });
    }else {
      search({});
    }
  }, [data]);

  /* useImperativeHandle和forwardRef是联合使用的，自定义ref实例对象，
   * 在里面定义暴露给父组件的方法, 父组件中使用useRef可拿到子组件实例、调用自定义方法和属性
   */
  useImperativeHandle(ref, () => ({
    search,
    getData: () => dataSource,
  }));

  const tableProps: any = useMemo(() => ({
      // bordered: true,
      rowKey: 'id',
      ...tableFields,
      id: 'custom-table',
      columns: ([{
        title: '序号',
        dataIndex: 'no',
        width: '5%',
        editable: true,
        key: 'num',
        render: (text, record, index) => `${index + 1}`,
      },]).concat(tableFields.columns)
        .map(item => ({
          ...item,
          align: 'center',
        })),
    }),
    [JSON.stringify(tableFields)],
  );

  return <Table {...tableProps}
              dataSource={dataSource}
              loading={loading}
              pagination={pagination}
              className={style.table}
              rowClassName={style.row}
  />;
};
// redux清除了withRef,要使用ref，需要配置forwardRef:true
export default forwardRef(CustomTable);
