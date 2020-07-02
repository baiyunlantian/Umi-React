//场景管理模块
import React, { useState, useEffect, useRef } from 'react';
import BaseForm from '@/pages/components/base-form';
import {
  getCampusList,
  updateCampus,
  addCampus,
  delCampus
} from '@/services/scene';
import styles from './index.less';
import { Form, Input, Button, Modal, message } from 'antd';
import SvgIcon from '@/components/svg/icon';

// import { mapConfig } from '@/pages/components/vtouch/vtouch-map';
// import IRangeMap from '@/pages/components/map/project/campus/ui/subjoin/ui.comp';
import { controlRange, searchAddress, Config } from '@/pages/components/map';
import { dynamic } from 'umi';
import { mapDivUpdate } from '../components/map';

const IRangeMap = dynamic({
  loader: async function () {
    const { default: IRangeMap } = await import('@/pages/components/map/project/campus/ui/subjoin/ui.comp');
    return IRangeMap;
  },
});

export default () => {

  const baseForm = useRef();
  const [delModalVisible, setDelModalVisible] = useState(false);
  const [campusList, setCampusList] = useState([]);
  const [currentCampusInfo, setCurrentCampusInfo] = useState({});
  const [schoolName, setSchoolName] = useState('');
  const [selectCampusId, setSelectCampusId] = useState('');
  const [delActive, setDelButtonActive] = useState(false);
  const [updateActive, setUpdateActive] = useState(false);
  const [addActive, setAddActive] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  let [showRangeIndex, showRangeIndexValues] = useState(Number);
  const showRange = new controlRange();
  const address = new searchAddress();

  useEffect(() => {
    const { schoolName } = JSON.parse(window.localStorage.getItem('campus')!);
    setSchoolName(schoolName);
    getCampusList({ isNeedAccount: 1 }).then(res => {
      if (res.data) {
        if (res.data.campusList && res.data.campusList.length > 0) {
          const { campusList } = res.data;
          if (!campusList.length) {
            return;
          };
          setCampusList(campusList);
          setCurrentCampusInfo(campusList[0]);
          setSelectCampusId(campusList[0].id);
          setInitialValues({ name: campusList[0].name });

          showRangeIndexValues(0);
          showRange.showRangeUpdate(campusList[showRangeIndex]);
        }
      }
    });

    return () => {
      // new mapDivUpdate().getCanvasdomElementById(Config.IMapContainer);
    };
  }, []);

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      md: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      md: { span: 14 }
    }
  };

  let updateFormList = [
    { name: 'name', label: '校区名称', type: 'input' },
  ];

  let addFormList = [
    { name: 'name', label: '校区名称', type: 'input' },
    { name: 'username', label: '管理账号', type: 'input' },
    { name: 'password', label: '密码', type: 'input' },
    { name: 'address', label: '地区选择', type: 'input' },
    { name: 'locationPointer' },
    { name: 'locationScope' },
  ];

  const formProps = {
    initialValues,
    hiddenFooter: true,
    formList: addActive ? addFormList : updateFormList,
    disabled: addActive ? false : updateActive ? false : true
  };

  const delCampusState = (campusId: any) => {
    setSelectCampusId(campusId);
    setDelModalVisible(true);
    setDelButtonActive(true);
  };

  const updateCampusState = (campusId: any) => {
    setUpdateActive(!updateActive);
    setAddActive(false);

    showRange.createProvider();

    showRange.mapRequestRender();
  };

  const addCampusState = (campusId: any) => {
    setAddActive(!addActive);
    setUpdateActive(false);
    setInitialValues({});
    setTimeout(() => baseForm.current.resetFields(), 10);

    showRange.createProvider();

    showRange.mapRequestRender();
  };

  const cancelBtn = () => {
    setInitialValues({ name: currentCampusInfo.name });
    setAddActive(false);
    setUpdateActive(false);
    console.log(showRangeIndex);
    showRange.exitProvider(campusList as [], showRangeIndex);
  };

  const confirmDelCampus = () => {
    delCampus({ id: selectCampusId }).then(res => {
      if (res.data) {
        message.info('删除成功');
        setDelModalVisible(false);
        setDelButtonActive(false);

        const localStorageCampusList: { campusId: any; campusName: any; }[] = [];
        const list: { id: any; name: any; }[] = [];
        campusList.forEach(item => {
          if (item.id !== selectCampusId) {
            localStorageCampusList.push({ campusId: item.id, campusName: item.name });
            list.push(item);
          }
        });

        console.log(list);
        setCampusList(list);
        setCurrentCampusInfo(list[0]);
        setSelectCampusId(list[0].id);
        setInitialValues({ name: list[0].name });

        const localStorageCampus = JSON.parse(window.localStorage.getItem('campus'));
        localStorageCampus.campusList = localStorageCampusList;
        window.localStorage.setItem('campus', JSON.stringify(localStorageCampus));
      } else {
        message.info('删除失败');
      }
    });
  };

  const selectCampus = (index: number, campusId: string) => {
    setSelectCampusId(campusId);
    setCurrentCampusInfo(campusList[index]);
    setInitialValues({ name: campusList[index].name });
    setAddActive(false);
    setUpdateActive(false);

    showRangeIndexValues(index)
    showRange.showRangeUpdate(campusList[index]);
  };

  const searchBtn = () => {

    const values = baseForm.current.getFormValues();
    console.log(values);

    address.searchAddress(values.address);
  };

  const onFinish = (campusId: number) => {
    const values = baseForm.current.getFormValues();

    const locationPointer = JSON.stringify(showRange.point);
    const scope = { app: { version: Config.version, range: Config.variable.zone } };
    const locationScope = JSON.stringify(scope);
    if (campusId) {

      updateCampus({
        id: campusId,
        name: values.name,
        locationPointer: locationPointer,
        locationScope: locationScope,
      }).then(res => {
        if (res.data) {
          message.info('修改成功');
          setUpdateActive(false);

          const localStorageCampusList: { campusId: any; campusName: any; locationPointer: Object; locationScope: Object; }[] = [];
          const list = campusList.map(item => {
            if (item.id == campusId) {
              item.name = values.name;
              item.locationPointer = locationPointer;
              item.locationScope = locationScope;
              localStorageCampusList.push({
                campusId: item.id,
                campusName: values.name,
                locationPointer: showRange.point,
                locationScope: scope,
              });
            } else {
              localStorageCampusList.push({
                campusId: item.id,
                campusName: item.name,
                locationPointer: item.locationPointer,
                locationScope: item.locationScope,
              });
            }
            return item;
          });

          setCampusList(list);

          const localStorageCampus = JSON.parse(window.localStorage.getItem('campus'));
          localStorageCampus.campusList = localStorageCampusList;
          window.localStorage.setItem('campus', JSON.stringify(localStorageCampus));
        }
      });
    } else {
      values.locationPointer = locationPointer;
      values.locationScope = locationScope;
      addCampus(values).then(res => {
        if (res.data) {
          message.info('新增成功');
          setAddActive(false);
          baseForm.current.resetFields();

          getCampusList({ isNeedAccount: 1 }).then(res => {
            if (res.data) {
              if (res.data.campusList && res.data.campusList.length > 0) {
                const { campusList } = res.data;
                setCampusList(campusList);
                setCurrentCampusInfo(campusList[0]);
                setSelectCampusId(campusList[0].id);
                setInitialValues({ name: campusList[0].name });

                const localStorageCampusList = campusList.map(item => ({ campusId: item.id, campusName: item.name }));
                const localStorageCampus = JSON.parse(window.localStorage.getItem('campus'));
                localStorageCampus.campusList = localStorageCampusList;
                window.localStorage.setItem('campus', JSON.stringify(localStorageCampus));
              }
            }
          });
        }
      });
    }
  };

  return (
    <div className='custom-main-content'>
      <div className={styles.campusManagement}>
        <div className={styles.title}>
          <div className={styles.titleLeft}>
            <span>校区管理</span>
            <span>Management</span>
          </div>
          <div className={styles.titleRight}>{schoolName}</div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentLeft}>
            <div className={styles.campusList}>
              {
                (campusList || []).map((item, index) => {
                  return (
                    <div
                      onClick={e => { selectCampus(index, item.id) }}
                      className={selectCampusId === item.id ? styles.activeCampusItem : styles.campusItem}
                      key={item.id}
                    >
                      {schoolName}-{item.name}
                    </div>
                  )
                })
              }
            </div>
            <div
              className={addActive ? styles.activeAddCampus : styles.addCampus}
              onClick={e => addCampusState(e)}
            >
              新增校区
          </div>
          </div>
          <div className={styles.contentRight}>
            <Form
              form={form}
              onFinish={() => onFinish('')}
            >
              <div className={styles.contentTitle}>
                <div className={styles.titleLeft}>
                  校区管理-{currentCampusInfo.name || ''}
                </div>
                <div className={styles.titleRight}>
                  <div style={addActive ? { display: 'none' } : { display: 'flex' }} className={styles.campusInfo}>
                    <div>校区管理账号:<span>{currentCampusInfo.username || ''}</span></div>
                    <div>密码:<span>{currentCampusInfo.password || ''}</span></div>
                  </div>
                  <div style={addActive ? { display: 'inline-block' } : { display: 'none' }} className={styles.addCampusButton}>
                    <Button type="primary" htmlType="submit">
                      添加
                  </Button>
                    <Button
                      style={{ marginLeft: '10px' }}
                      onClick={cancelBtn}
                    >
                      取消
                  </Button>
                  </div>
                </div>
              </div>
              <div className={styles.contentBox}>
                <div className={addActive ? styles.addCampusForm : styles.updateCampusForm}>
                  <BaseForm
                    ref={baseForm}
                    {...formProps}
                    formItemLayout={formItemLayout}
                  />
                  {addActive ?
                    <SvgIcon
                      tipTitle='定位'
                      name='location'
                      className={styles.searchCampusMap}
                      width={25}
                      height={25}
                      color="rgb(0, 0, 0)"
                      onClick={searchBtn}
                    />
                    : ''}
                </div>

                {/*修改删除操作*/}
                {
                  addActive
                    ? ''
                    :
                    <div className={styles.operationCampus}>
                      {updateActive ? <span className={styles.confirmBtn} onClick={() => onFinish(currentCampusInfo.id)}>确定</span> : ''}
                      {updateActive ? <span className={styles.cancelBtn} onClick={cancelBtn}>取消</span> : ''}
                      {updateActive ?
                        <SvgIcon
                          tipTitle='编辑'
                          name='update'
                          className={styles.active}
                          width={25}
                          height={25}
                          color="rgb(0, 0, 0)"
                          onClick={updateCampusState}
                        />
                        :
                        <SvgIcon
                          tipTitle='编辑'
                          name='update'
                          className={styles.default}
                          width={25}
                          height={25}
                          color="rgb(56, 220, 255)"
                          onClick={updateCampusState}
                        />
                      }
                      {delActive ?
                        <SvgIcon
                          tipTitle='删除'
                          name='delete'
                          className={styles.active}
                          width={25}
                          height={25}
                          color="rgb(0, 0, 0)"
                          onClick={() => delCampusState(currentCampusInfo.id)}
                        />
                        :
                        <SvgIcon
                          tipTitle='删除'
                          name='delete'
                          className={styles.default}
                          width={25}
                          height={25}
                          color="rgb(56, 220, 255)"
                          onClick={() => delCampusState(currentCampusInfo.id)}
                        />
                      }
                    </div>
                }
                <div className={styles.map}>
                  <IRangeMap />
                </div>
              </div>
            </Form>
          </div>
        </div>

        {/*  删除确认框*/}
        <Modal
          className={styles.sceneDelModal}
          visible={delModalVisible}
          onOk={confirmDelCampus}
          onCancel={() => { setDelModalVisible(false) }}
          okText='确认'
          cancelText='取消'
          closable={false}
        >
          <p style={{ fontSize: 24, margin: 0, color: '#fff' }}>确认删除该校区吗?</p>
          <p style={{ fontSize: 16, margin: 0, color: '#c10000' }}>删除后该校区所以相关信息将被删除，请谨慎操作!</p>
        </Modal>
      </div>
    </div>
  )
}

