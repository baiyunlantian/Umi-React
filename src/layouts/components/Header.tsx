import React, { useState, useEffect, useMemo } from 'react';
import { Link, useIntl, history, NavLink } from 'umi';
import HeaderLogo from '@/assets/header_logo.png';
import { Avatar, Menu, Col, Row, Dropdown } from 'antd';
//import { formatMessage } from 'umi-plugin-react/locale';
import Svg from '@/components/svg'
import { UserOutlined, SettingFilled, LoginOutlined } from '@ant-design/icons';
import { useModel } from "@/.umi/plugin-model/useModel";
import Logo from '@/assets/logo.png';
import { Campus, MenuInfo } from "@/type";
// import { mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig } from 'vtouch-map';

const { Icon, Text } = Svg;

export default props => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [cDay, setCDay] = useState('');
  const [eDay, setEDay] = useState('');

  const [isRootMenu, setIsRootMenu] = useState(true); //一级目录（展示校区）


  const { initialState, loading, error, refresh, } = useModel('@@initialState');
  const campusId = JSON.parse(localStorage.getItem('campus') || "{}").campusId;

  const childrenMenu = [
    { key: 'campus', label: '实时统计' },
    { key: 'exception-query', label: '异常查询' },
    { key: 'health-management', label: '健康管理' },
    { key: 'visitor-management', label: '访客管理' },
    { key: 'attendance-management', label: '考勤管理' },
    { key: 'person-management', label: '人员管理' },
    { key: 'class-management', label: '班级管理' },
    { key: 'device-management', label: '设备管理' },
  ];

  const menuList = useMemo(() => {
    if (!initialState) return [];
    const { campusList } = initialState;
    if (isRootMenu) {
      return (campusList || []).concat(
        { key: 'scene-management', label: '场景管理' },
      )
    } else {
      return childrenMenu
    }
  }, [isRootMenu, initialState]);

  useEffect(() => {
    let value = new Date();
    let date = value.toLocaleDateString().replace(/\//g, '.');
    let time = value.toTimeString().substring(0, 8);
    let cDay = '';
    let eDay = '';
    switch (value.getDay()) {
      case 0:
        cDay = '周日';
        eDay = 'Sunday';
        break;
      case 1:
        cDay = '周一';
        eDay = 'Monday';
        break;
      case 2:
        cDay = '周二';
        eDay = 'TuesDay';
        break;
      case 3:
        cDay = '周三';
        eDay = 'WednesDay';
        break;
      case 4:
        cDay = '周四';
        eDay = 'Thursday';
        break;
      case 5:
        cDay = '周五';
        eDay = 'Friday';
        break;
      case 6:
        cDay = '周六';
        eDay = 'Saturday';
        break;
    };
    setDate(date);
    setTime(time);
    setCDay(cDay);
    setEDay(eDay);
  }, []);


  const { pathname } = props;
  useEffect(() => {
    if (pathname === '/' || pathname.indexOf('scene-management') >= 0) {
      setIsRootMenu(true);
    } else {
      setIsRootMenu(false);
    }
    //解决初次登录学校账号时，点击场景管理页面跳转然后自动跳回首页的bug
    if (pathname.lastIndexOf('/') === 0) {
      history.location.pathname = pathname;
    }
  }, [pathname]);
  const { formatMessage } = useIntl();

  // 页面刷新，初始化功能名称
  const [functionName, setFunctionName] = useState(
    formatMessage({
      id: `menu${pathname
        .replace(/\/:[\s\S]*/g, '') // 替换路径参数
        .replace(/\//g, '.')}`,
    }),
  );

  // 路由点击事件
  const handleMenuClick = route => {
    setFunctionName(route.label);
  };
  const onMenuClick = e => {
    switch (e.key) {
      case 'logout':
        window.localStorage.setItem('token', '');
        history.push('user/login');
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item disabled>
        <UserOutlined />
        个人中心
      </Menu.Item>

      <Menu.Item key="modifyPwd">
        <SettingFilled />
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LoginOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const logoTextProps = {
    className: 'font-logo',
    text: '智慧校区',
    width: window.innerWidth * 0.094,
    height: window.innerHeight * 0.058,
    x: '50%',
    y: '80%',
    linearGradientList: [
      { color: 'rgb(70,243,252)', offset: '0%' },
      { color: 'rgb(33,141,236)', offset: '50%' },
      { color: 'rgb(9,58,209)', offset: '100%' },
    ]
  };

  return (
    <div className="header-area">
      <div className='top'>
        <div className="left">
          {/*<Text {...logoTextProps}/>*/}
          {/*<div className="header-title">防控综合管理平台</div>*/}
          <img src={Logo} />
        </div>
        <div className="logoImg">
          {/*返回校区首页*/}
          <img src={HeaderLogo} className="header-logo" onClick={() => { history.push('/') }} />
        </div>
        <div className="center">
          {
            menuList.map((item: any, index) => {
              //校区登录
              if (campusId !== null) {
                if (isRootMenu) {
                  //非本校区禁止点击
                  if (item.campusId !== campusId) {
                    return (
                      <div key={index} style={{ color: 'gray', cursor: 'not-allowed' }}>
                        {item.label || item.campusName}
                      </div>
                    )
                  } else {
                    return (
                      <Link to="campus"
                        key={index}
                        className={(props.pathname.slice(1) || '').indexOf(item.key) >= 0 ? 'active' : ''}
                        innerRef={node=>{node && node.setAttribute('ondragstart','return false')}}
                        onClick={() => {
                          if (item.campusId) {
                            // 点击校区进入详情
                            window.localStorage.setItem('currentCampus', JSON.stringify({ campusId: item.campusId, campusName: item.campusName }));
                          }
                        }}
                      >
                        {item.label || item.campusName}
                      </Link>
                    )
                  }
                } else {
                  return (
                    <Link
                      key={index}
                      to={item.key}
                      className={(props.pathname.slice(1) || '').indexOf(item.key) >= 0 ? 'active' : ''}
                      innerRef={node=>{node && node.setAttribute('ondragstart','return false')}}
                      onClick={() => {
                        //解决在二级页面点击导航栏跳转一级页面bug
                        if (pathname.lastIndexOf('/') !== 0) {
                          history.location.pathname = '/';
                        }
                      }}
                    >
                      {item.label || item.campusName}
                    </Link>
                  )
                }
              }
              //学校登录
              else {
                return (
                  <Link
                    key={index}
                    to={item.key || "campus"}
                    className={(props.pathname.slice(1) || '').indexOf(item.key) >= 0 ? 'active' : ''}
                    onClick={() => {
                      if (item.campusId) {
                        // 点击校区进入详情
                        window.localStorage.setItem('currentCampus', JSON.stringify({ campusId: item.campusId, campusName: item.campusName }));
                      } else {
                        //解决在二级页面点击导航栏跳转一级页面bug
                        if (pathname.lastIndexOf('/') !== 0) {
                          history.location.pathname = '/';
                        }
                      }
                    }}
                  >
                    {item.label || item.campusName}
                  </Link>
                )
              }
            }
            )
          }
        </div>
      </div>
      <div className="admin-center">
        <Icon name="user" color="white" />
        <span className="user-role">Admin</span>
        <Icon name="exit" color="white" width={28} height={28}
          onClick={() => {
            window.localStorage.clear();
            history.push('user/login');
          }}
        />
      </div>
      <div className='headerTime'>
        <div className='colOne'>
          <div>{date}</div>
          <div>{eDay}</div>
        </div>
        <div className='colTwo'>{cDay}</div>
        <div className='colThree'>{time}</div>
      </div>
    </div>
  );
};
