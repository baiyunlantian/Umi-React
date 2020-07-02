//首页统计页面
import React, { useState, useEffect, Fragment } from 'react';
import styles from './index.less';
import PeopleCount from '@/pages/components/person-count';
import AnimalHeat from '@/pages/components/animalHeat';
import Attendance from '@/pages/components/attendance';
import Visitors from '@/pages/components/visitors';
import {
  getCampusTotalPerson,
  getCampusTotalAttendance,
  getCampusTotalAnimalHeat,
  getCampusTotalVisitor
} from '@/services/campus';
// import IMapContainer from '@/pages/components/map/project/campus/ui/container/ui.comp';
// import IHomeMap from '@/pages/components/map/project/campus/ui/home/ui.comp';
// import { Config, mapDivUpdate } from '@/pages/components/map';

import { dynamic } from 'umi';

// const IMapContainer = dynamic({
//   loader: async function () {
//     const { default: IMapContainer } = await import('@/pages/components/map/project/campus/ui/container/ui.comp');
//     return IMapContainer;
//   },
// });

const IHomeMap = dynamic({
  loader: async function () {
    const { default: IHomeMap } = await import('@/pages/components/map/project/campus/ui/home/ui.comp');
    return IHomeMap;
  },
});



export default () => {

  const [personProps, setPersonProps] = useState({});
  const [attendanceProps, setAttendanceProps] = useState({});
  const [animalHeatProps, setAnimalHeatProps] = useState({});
  const [visitorProps, setVisitorProps] = useState({});

  const campus = JSON.parse(window.localStorage.getItem('campus') || '{}');
  const {schoolId,campusId} = campus;


  useEffect(() => {
    getCampusTotalPerson({schoolId,campusId}).then(res => {
      let list = [];
      let total = 0;
      if (res.data) {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.map((item, index) => {
            total += item.personTotal;
            list.push({ value: item.personTotal, name: item.campusName })
          });
        }
      }
      setPersonProps({ total, list });
    });

    getCampusTotalAttendance({schoolId,campusId}).then(res => {
      if (res.data) {
        if (res.data.haveRule) setAttendanceProps(res.data.dto);
      }
      // console.log(res);
    });

    getCampusTotalAnimalHeat({schoolId,campusId}).then(res => {
      if (res.data) setAnimalHeatProps(res.data);

      // console.log(res);
    });

    getCampusTotalVisitor({schoolId,campusId}).then(res => {
      if (res.data) setVisitorProps(res.data);
      // console.log(res);
    });

    return () => {
      // new mapDivUpdate().getCanvasdomElementById(Config.IMapContainer);
    };

  }, []);

  return (
    <Fragment>
      <IHomeMap />
      <div className={styles.infoLeft} style={{ left: '2%' }}>
        {/*校区总人数*/}
        <PeopleCount {...personProps} campusId={campusId} />

        {/*体温统计*/}
        <AnimalHeat {...animalHeatProps} campusId={campusId}/>
      </div>

      <div className={styles.infoRight} style={{ right: '2%' }}>
        {/*校园考勤统计*/}
        <Attendance {...attendanceProps} campusId={campusId} />

        {/*校区访客统计*/}
        <Visitors {...visitorProps} campusId={campusId} />
      </div>
    </Fragment>
  );
};
