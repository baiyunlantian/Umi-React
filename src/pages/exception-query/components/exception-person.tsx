import React, { useEffect, useState, useRef } from 'react';
import SvgIcon from '@/components/svg/icon';
import style from './exception-person.less';

export default ({exceptionPersonList, handleVisible, showConfirmModal}) => {
  return (
    <>
      {(exceptionPersonList || []).map(item => {
        return (<div className={style.exceptionItem}>
          <div className={style.operationImg}>
            <SvgIcon
              tipTitle='详情'
              name='detail'
              width={20}
              height={20}
              color="rgb(56, 220, 255)"
              onClick={() => handleVisible(true,item.roleId,item.accessId)}
            />
            <SvgIcon
              tipTitle='编辑'
              name='update'
              width={25}
              height={25}
              color="rgb(56, 220, 255)"
              onClick={() => showConfirmModal('update',item.personId, item.accessId)}
            />
          </div>
          <div className={style.itemInfo}>
            <div className={style.left}>
              <div className={style.img}>
                <img src={item.url || ''}/>
              </div>
              <div className={style.name}><span>{item.name}</span></div>
            </div>
            <div className={style.right}>
              <div>性别：<span>{item.sex === 1 ? '男' : '女'}</span></div>
              <div>身份证号：<span>{item.ipNum}</span></div>
              {item.roleName === '学生'
                ?
                <div>班级：<span>{item.className}</span></div>
                :
                <div>手机：<span>{item.phone}</span></div>
              }
              <div>角色：<span>{item.roleName}</span></div>
              <div>时间：<span>{item.checkTime}</span></div>
              <div className={style.heat}>
                <div>体温：<span className={style.redColor}>{item.temp} ℃</span></div>
                <div>状态：<span className={item.isDeal === 1 ? style.greenColor : style.redColor}>{item.isDeal === 1 ? '已处理' : '未处理'}</span></div>
              </div>
            </div>
          </div>
        </div>)
      })}
    </>
  );

};
