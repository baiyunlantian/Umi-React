import React,{useState} from 'react';
import styles from '../schedule.less';

export default ({month, list,settingScheduleYear, currentDate, onChange}) => {
  const week = ['一','二','三','四','五','六','日'];

  const renderCalendarCell = (data:object, endDate:number) => {
    //value 格式 : YYYY-MM-DD
    const dateObject = new Date(settingScheduleYear + '-' + month + '-' + data.dayNum);
    const day = dateObject.getDay();  //星期几
    let element = [];
    const spanStyleName = 'dateState' + data.feature;
    const spanElement = <span
      onClick={()=>onChange(data.dayId, settingScheduleYear + '-' + month + '-' + data.dayNum, month)}
      className={currentDate == settingScheduleYear + '-' + month + '-' + data.dayNum ? styles.dateState3 : styles[spanStyleName]}
    >
      {data.dayNum}
    </span>;

    //当月第一天
    if (data.dayNum == 1){
      element = completeBlankCellCount('start',day);
      element.push(spanElement);
    }
    //当月最后一天
    else if (data.dayNum == endDate){
      element = completeBlankCellCount('end',day);
      element.unshift(spanElement);
    }
    else {
      element.push(spanElement);
    }

    return element;
  };

  //计算渲染空白格的数量
  const completeBlankCellCount = (type:string,dateParam:number) => {
    let day = dateParam == 0 ? 7 : dateParam ;    //星期几
    let count = 0;
    let elementArray = [];
    if (type == 'start'){
      count =  day - 1;
    }else if (type == 'end'){
      count =  7 - day;
    }

    for (let i=0; i<count; i++){
      elementArray.push(<span key={i}></span>)
    }

    return elementArray;
  };


  //渲染每个月
  const renderCalendarList = () => {
    const monthLength = new Date(settingScheduleYear,month,0).getDate();  //该月天数
    const setTimeList: number[] = [];   //已设置的时间(已完成、已安排)
    let spanElementList: any[] = [];

    if (list && list.length > 0){
      list.forEach(item=>{setTimeList.push(item.dayNum)});
    }

    for(let i = 1; i <= monthLength; i++){
      if (setTimeList.indexOf(i) >= 0){
        const el = renderCalendarCell(list[setTimeList.indexOf(i)], monthLength);
        spanElementList.push(el);
      }else {
        const el = renderCalendarCell({dayId:null,dayNum:i,feature:2}, monthLength);
        spanElementList.push(el);
      }
    }

    return spanElementList;
  };

  return(
    <div className={styles.calendarItem}>
      <div className={styles.tableTile}>
        {settingScheduleYear}-{month}
      </div>
      <div className={styles.thead}>
        {
          week.map(item=><span key={item}>{item}</span>)
        }
      </div>
      <div className={styles.tbody}>
        {renderCalendarList()}
      </div>
    </div>
  )
};
