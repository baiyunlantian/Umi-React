import { Alert, Checkbox, Form, Input, Button} from 'antd';
import React, { useState, useRef } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { Link, history } from 'umi';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import { ConnectState } from '@/models/connect';
import LoginFrom from './components/Login';
import { fakeAccountLogin } from '@/services/login';
import gonganImg from '@/assets/login/gongan.png';
import md5 from 'js-md5'

import styles from './style.less';
import { useModel } from 'umi';

const { Tab, UserName, Password, Mobile, Captcha, } = LoginFrom;
interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}

const Login: React.FC<LoginProps> = (props: any) => {
  const { submitting } = props;
  const [userName, setUserName] = useState<Boolean>(false);
  const [password, setPassword] = useState<Boolean>(false);
  const [err,setError] =  useState<Boolean>(false);

  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  const handleSubmit = async (values:any) => {
    // 目前后端还没做加密
    // values.password = md5(values.password.toString());
    try {
      const { data } = await fakeAccountLogin(values);
      const {token,campus} = data;
      localStorage.setItem("token",token || '');
      localStorage.setItem("campus",JSON.stringify(campus) || '');
      localStorage.setItem("currentCampus",'');
      setInitialState({token,campusList: campus.campusList});
      history.push("/")
    }catch (e) {
      console.log(e);
      setError(true);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.loginArea}>
        <div className={styles.left}>
          <img
            alt="logo"
            className={styles.logo}
            src={require('@/assets/login/logo.png')}
          />
          <img
            alt="logo"
            className={styles.logo}
            src={require('@/assets/logo.png')}
          />
        </div>
        <div className={styles.right}>
          <Form
            onFinish={handleSubmit}
          >
              <Form.Item
                name="username"
                className={userName ? styles.userNameLight : styles.userNameDark}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              >
                <Input
                  type='text'
                  placeholder="请输入账号"
                  onChange={(e)=> {e.target.value ? setUserName(true) : setUserName(false)}}
                />
              </Form.Item>
              <Form.Item
                name="password"
                className={password ? styles.passwordLight : styles.passwordDark}
                rules={[
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ]}
              >
                <Input
                  type='password'
                  placeholder="请输入密码"
                  onChange={(e)=>{e.target.value ? setPassword(true) : setPassword(false)}}
                />
              </Form.Item>
            <div className={styles.loginButtonDiv}>
              <Button htmlType="submit" className={styles.loginButton} loading={submitting}>登录</Button>
            </div>
            {err&&<div className={styles.loginMessage}>用户名或密码错误</div>}
          </Form>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerTop}>广州市微智联科技有限公司</div>
        <div className={styles.footerBottom}>
          @Copyright Guangzhou V-touch Technology Co.,Ltd{' '}
        </div>
        <div className={styles.footerBottom}>
          <a href='http://beian.miit.gov.cn/' target='_blank' style={{color: '#f1f1f1',textDecoration: 'underline'}}>
            <img src={gonganImg} />粤ICP备20030879号
          </a>
        </div>
      </div>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
