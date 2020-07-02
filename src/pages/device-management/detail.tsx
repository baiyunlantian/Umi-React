import React, { useEffect, useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import BaseForm from '@/pages/components/base-form';
import edit from '@/assets/exception-query/edit.png';
import settingImg from '@/assets/exception-query/setting.png';
import slideAutoImg from '@/assets/device/slideAutoImg.png';
import bgImg from '@/assets/device/device-bgc1.png';
import styles from './detail.less';
import CusTomUpload, {onUpload} from '@/pages/components/upload';
import { getDeviceSlideList, setSlideItemShow, getVoiceInfo, updateVoiceInfo } from '@/services/device';
import { Tabs, Checkbox, Button, Upload, Switch, message } from 'antd';
import style from '@/pages/class-management/detail.less';
import { models } from '@@/plugin-model/Provider';
import { history } from 'umi';

export default () => {

  const campus = JSON.parse(window.localStorage.getItem('campus'));
  const baseForm = useRef();
  const voiceForm = useRef();
  const { TabPane } = Tabs;

  const [slideList, setSlideList] = useState([]);
  const [slideInitialValues, setSlideInitialValues] = useState({});
  const [imgUrl, setImgUrl] = useState();
  const [showEditSlide, setShowEditSlide] = useState(false);
  const [showSlideCheckbox, setShowSlideCheckbox] = useState(false);
  const [voiceFormDisabled, setVoiceFormDisabled] = useState(true);
  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [title3, setTitle3] = useState('');
  const [title4, setTitle4] = useState('');
  const [createImgUrl, setCreatImgUrl] = useState('');    //生成的图片地址
  const [isReview, setIsReview] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState({});
  const [currentSort, setCurrentSort] = useState(0);
  const [selectState, setSelectState]:[Array<string>, Function] = useState([]);
  const campusId = JSON.parse(localStorage.getItem('currentCampus')!).campusId;


  useEffect(()=>{
    getDeviceSlideList({id: campusId}).then(res=>{
      if (res.data){
        setSlideList(res.data.slideshow);
      }
    });

    getVoiceInfo({id: campusId}).then(res=>{
      if (res.data){
        setVoiceInfo(res.data.voiceInfo);
      }
    });

    return clearInterval(window.timer);
  },[]);

  //点击添加轮播图
  const addSlideItem = (sort:number) => {
    console.log(sort);
    setCurrentSort(sort);
    setSlideInitialValues({});
    if (!showSlideCheckbox){
      setShowEditSlide(true);
    }
  };

  //查看轮播图详情
  const showSlideDetail = (data:object, index:number, sort:number) => {

    if (!showSlideCheckbox){
      setSelectState((value:Array<string>) => {
        let arr = [];
        arr[index] = true;
        return arr;
      })

      setCurrentSort(sort);
      setSlideInitialValues(data);
      setShowEditSlide(true);
      const {title1, title2, title3, title4} = data;
      setTitle1(title1);
      setTitle2(title2);
      setTitle3(title3);
      setTitle4(title4);
    }
  };

  const changeReview = (checked:boolean) => {
    setIsReview(checked);
  };

  const startUpload = (file?:File) => {

    console.log(currentSort);
    onUpload( '/api/data-server/terminal/uploadSlideshow', {
      campusId: campusId,
      sort: currentSort,
    },() => {
      // 关闭编辑页面
      setSlideInitialValues({});
      setShowEditSlide(false);
      setImgUrl(undefined);
      // 刷新
      getDeviceSlideList({id: campusId}).then(res=>{
        if (res.data){
          setSlideList(res.data.slideshow);
        }
      });

      setTitle1('');
      setTitle2('');
      setTitle3('');
      setTitle4('');
    }, file? file : undefined);

  };


  const handleUpdateVoice = (voiceType:string, state?:boolean) => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    const values = voiceForm.current.getFormValues();
    let data = {
      ...values
    };

    if (voiceType == 'passVoiceOn'){
      if (state == true){
        data.passVoiceOn = 0;
      }else{
        data.passVoiceOn = 1;
      }
      data.missVoiceOn = voiceInfo.missVoiceOn;
    }else if(voiceType == 'missVoiceOn') {
      if (state == true) {
        data.missVoiceOn = 0;
      } else {
        data.missVoiceOn = 1;
      }
      data.passVoiceOn = voiceInfo.passVoiceOn;
    }

    updateVoiceInfo({campusId,...data}).then(res=>{
      if (res.data){
        getVoiceInfo({id: campusId}).then(res=>{
          if (res.data){
            setVoiceInfo(res.data.voiceInfo);
          }
        });
      }
    });
  };

  // 多选框
  const changeCheckbox = (value:any) => {
    setSlideList(list => {

      list.map(item => {
        value.includes(item.id) ? item.isShow = 1 : item.isShow = 0;
      });
      return [...list]
    })
  };
  // 选中list
  const checkboxList = useMemo(() => {
    return slideList.filter(item =>{ return item.isShow === 1 }).map(item => item.id);
  }, [slideList])


  const handleUpdateSlideList = () => {
    if (campus.campusId == null){
      message.info('非本校区无操作权限!');
      return;
    }
    setSlideItemShow({
      campusId,
      slideshowIds: checkboxList
    }).then(res=>{
      if(res.data) {
        message.info('保存成功');
        setShowSlideCheckbox(false);
      }else {
        message.error('保存失败')
      }
    })
  };

  //渲染轮播图
  const renderSlideItem = (sort:number,index:number) => {
    let slideItem = <div className={styles.addSlideItem}
                         style={{border: currentSort == sort ? 'dashed 1px #00e7ff' : ''}}
                         onClick={()=>addSlideItem(sort)}>+</div>;

    if (slideList.length > 0){
      slideList.map(item=>{
        if (item.sort == sort){
          slideItem =
            <div
              className={styles.slideItem}
              onClick={()=>showSlideDetail(item, index,sort)}
              style={{border: currentSort == item.sort ? 'dashed 1px #00e7ff' : ''}}
            >
              <img width='100%' height='100%' src={item.url} alt='轮播图' />
              <Checkbox
                value={item.id}
                style={showSlideCheckbox ? {display:'inline-block'} : {display:'none'}}
              ></Checkbox>
            </div>;
        }
      });
    }

    return slideItem;
  };

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const voiceFormItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 12 },
  };


  const onFinish = () => {
    // const values = baseForm.current.getFormValues();
    changeReview(true);
    //生成图片
    clearInterval(window.timer);
    let element;
    window.timer = setInterval(() => {
      element = document.querySelector('.reviewImg');
      if(element) {
        clearInterval(window.timer);
        html2canvas(element).then((canvas)=>{
          //生成base64格式
          console.log(canvas.toDataURL());
          setCreatImgUrl(canvas.toDataURL());
          var arr = canvas.toDataURL().split(','), mime = arr[0].match(/:(.*?);/)![1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'image.png', {type:mime});
          startUpload(file);
        })
      }
    }, 10)
  };

  const handleTitleInput = ( type:string, e:object) => {
    if (type === 'title1'){
      setTitle1(e.title1);
    }else if(type === 'title2'){
      setTitle2(e.title2);
    }else if(type === 'title3'){
      setTitle3(e.title3);
    }else if(type === 'title4'){
      setTitle4(e.title4);
    }
  };

  const formProps = {
    hiddenFooter: true,
    initialValues:slideInitialValues,
    formList:[
      { name: 'title1', label: '标题一', type: 'input' ,onChange:(e) => handleTitleInput('title1',e)},
      { name: 'title2', label: '标题二', type: 'input' ,onChange:(e) => handleTitleInput('title2',e)},
      { name: 'title3', label: '标题三', type: 'input' ,onChange:(e) => handleTitleInput('title3',e)},
      { name: 'title4', label: '标题四', type: 'input' ,onChange:(e) => handleTitleInput('title4',e)},
    ],
  };

  //语音提示设置
  const voiceFormProps = {
    hiddenFooter: true,
    initialValues:voiceInfo,
    formList:[
      { name: 'passVoice', label: '验证通过语音提示', type: 'input' },
      { name: 'missVoice', label: '验证未通过语音提示', type: 'input' },
    ],
    disabled:voiceFormDisabled
  };




  return (
    <div className='custom-main-content'>
      <div className={styles.deviceDetail}>
        <Button onClick={() => {history.goBack();}} className={styles.goBack}>返回</Button>

      <div className={styles.top}>
        <div className={styles.title}>
          <div className={styles.text}>校园广播管理</div>
        </div>

        {/*  轮播图设置*/}
        <div className={styles.slideContent}>
          <div>轮播图设置</div>

            {
              !showSlideCheckbox
                ?
                <img className={styles.settingSlideImg} src={settingImg} alt='setting' onClick={()=>setShowSlideCheckbox(true)} />
                :
                <div className={styles.operationSlideList}>
                  <div className={styles.defaultStyleBtn} onClick={handleUpdateSlideList}>设置</div>
                  <div className={styles.defaultCancelBtn} onClick={()=>setShowSlideCheckbox(false)}>取消</div>
                </div>
            }
            <Checkbox.Group className={style.classCheckbox} value={checkboxList} onChange={(value)=>changeCheckbox(value)}>
              <div className={styles.slideList}>
                <div className={styles.slideItem}
                     onClick={()=>{
                       setCurrentSort(0);
                       setShowEditSlide(false);
                     }}
                >
                  <img width='100%' height='100%' src={slideAutoImg} alt='***' />
                </div>
                {
                  [1,2,3,4,5].map((item,index)=>{
                    return(
                      renderSlideItem(item,index)
                    )
                  })
                }
              </div>
            </Checkbox.Group>
        </div>

        { showEditSlide
          ?
          <div className={styles.editSlideContainer}>
            <Tabs className={styles.guest} defaultActiveKey="1">
            <TabPane tab="在线编辑 " key="1">
              <div className={styles.onLine}>
                <div className={styles.left}>
                  <div className={styles.tips}>提示：请在对应位置输入框中输入您所要替换的内容</div>
                  <BaseForm
                    ref={baseForm}
                    {...formProps}
                    formItemLayout={formItemLayout}
                  />
                  <Checkbox onChange={e=>changeReview(e.target.checked)} value='true'>预览</Checkbox>
                  <div className={styles.operationBtn}>
                    <div className={styles.cancelBtn} onClick={onFinish}>保存</div>
                    <div className={styles.cancelBtn} onClick={()=>setShowEditSlide(false)}>取消</div>
                  </div>
                </div>
                <div className={styles.right}>
                  预览效果
                  { isReview
                    ?
                    <div className={styles.reviewContainer}>
                      <div className='reviewImg'>
                        <img src={bgImg || ''} alt='***'/>
                        <div className={styles.title1}>{title1 || ''}</div>
                        <div className={styles.title2}>{title2 || ''}</div>
                        <div className={styles.title3}>{title3 || ''}</div>
                        <div className={styles.title4}>{title4 || ''}</div>
                      </div>
                    </div>
                    : ''}
                </div>
              </div>
            </TabPane>
            <TabPane tab="本地上传 " key="2">
              <div className={styles.localUpload}>
                <div className={styles.tips}>提示：支持下载背景图编辑或自定义图片编辑。图片尺寸：706*233PX；图片格式：JPG、PNG。</div>
                <div className={styles.operationImg}>
                  <div className={styles.downLoadingDiv}>
                    <div className={styles.downLoadingImg}>
                      <img src={bgImg || ''} alt='***'/>
                    </div>
                    <a className={styles.defaultStyleBtn} href={bgImg} download="点击下载背景" >点击下载背景图</a>
                  </div>
                  <div className={styles.uploadDiv}>
                    <div className={styles.upload}>
                      <img
                        width="100%"
                        height="100%"
                        src={imgUrl}
                        alt=""
                        draggable={false}
                      />
                    </div>
                    <CusTomUpload setImageUrl={setImgUrl}>
                      <div className={styles.defaultStyleBtn}>点击选择文件</div>
                    </CusTomUpload>
                  </div>
                  <div className={styles.handleUploadDiv}>
                    <CusTomUpload setImageUrl={setImgUrl} type="Dragger" >
                      {imgUrl ? <img
                        width="706px"
                        height="233px"
                        src={imgUrl}
                        alt=""
                        draggable={false}
                      />: <p>或者将文件拖动到此处</p>}
                    </CusTomUpload>
                  </div>
                </div>
                <div className={styles.defaultStyleBtn} style={{float: 'right',marginTop: 10,}} onClick={startUpload}>开始上传</div>
              </div>
            </TabPane>
          </Tabs>
          </div>
          : ''
        }

      </div>

      <div className={styles.bottom}>
        {
          voiceFormDisabled
            ?
            <img className={styles.settingVoiceImg} src={edit} alt='setting' onClick={()=>setVoiceFormDisabled(false)} />
            : ''
        }
        <div className={styles.title}>
          <div className={styles.text}>语音提示设置</div>
        </div>
        <BaseForm
          ref={voiceForm}
          {...voiceFormProps}
          formItemLayout={voiceFormItemLayout}
        />
        {
          voiceFormDisabled
            ?
            <div className={styles.switchBtn}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" checked={voiceInfo.passVoiceOn == 0 ? true :false}
                      onChange={(checked, event)=>{
                        handleUpdateVoice('passVoiceOn',checked);
                      }}
              />
              <Switch checkedChildren="ON" unCheckedChildren="OFF" checked={voiceInfo.missVoiceOn == 0 ? true :false}
                      onChange={(checked, event)=>{
                        handleUpdateVoice('missVoiceOn',checked);
                      }}
              />
            </div>
            :
            <div className={styles.operationVoice}>
              <div className={styles.defaultStyleBtn}
                   onClick={()=> {
                     handleUpdateVoice('');
                     setVoiceFormDisabled(true);
                   }
                   }
              >修改</div>
              <div className={styles.defaultCancelBtn} onClick={()=>setVoiceFormDisabled(true)}>取消</div>
            </div>
        }
      </div>

    </div>
    </div>
  );
};
