"use strict";
import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { mapConfig, API } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig, API } from 'vtouch-map';
import { controlRange } from '.';
import { MAPAPP, Config } from '../../../..';

export class searchAddress {

  public viewer?: Cesium.Viewer;
  public handler?: Cesium.ScreenSpaceEventHandler;
  private _currentLocaltion?: Cesium.Entity;

  constructor(viewer?: Cesium.Viewer, handler?: Cesium.ScreenSpaceEventHandler) {

    if (mapConfig.map instanceof MAPAPP) {
      this.viewer = mapConfig.map.viewer;


    }

    if (viewer) {
      this.viewer = viewer;
    } else {
      if (mapConfig.map instanceof MAPAPP) {
        this.viewer = mapConfig.map.viewer;
        // mapConfig.map.viewer.flyTo(target, {
        //   duration: 1.0,
        //   maximumHeight: 15000,
        //   offset: new Cesium.HeadingPitchRange(0, -1.57, 0),
        // });
      }
    }
    if (handler) {
      this.handler = handler;
    }
    this.initVtouchLOGO();

  };

  public initVtouchLOGO = () => {

    const option = {
      // position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
      name: name,
      position: Cesium.Cartesian3.fromDegrees(
        113.392971 - 0.01205,
        23.062786 - 0.00370,

        mapConfig.horizon * 20),
      billboard: {
        // image: fireOption.ionSrc,
        // image: require('@/assets/map/localtion.png'),
        image: require('@/assets/map/vtouch.png'),
        scale: 0.10,
        height: 256 * 2,
        width: 512 * 2,
        // width: 256,//* 2,
        // height: 256 * 2,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 99999999),
        // translucencyByDistance: new Cesium.NearFarScalar(
        //   1.5e2,
        //   2.0,
        //   1.5e7,
        //   0.5
        // ),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      // label: {
      //   // text: name,//+ address,
      //   font: '15pt Microsoft YaHei',//24px
      //   fillColor: Cesium.Color.RED,
      //   // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //   outlineWidth: 2,
      //   verticalOrigin: Cesium.VerticalOrigin.TOP,
      //   // pixelOffset: new Cesium.Cartesian2(0, 99999999),
      //   pixelOffset: new Cesium.Cartesian2(0, 99999999),
      // },
      // point: {
      //   pixelSize: 12,
      //   color: Cesium.Color.RED,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(225000, 99999999),
      // },
    }

    if (this.viewer && this.viewer.entities) {
      const entity = this.viewer.entities.add(option);
    }
  };

  //
  public searchAddress(address: string /*= '广州市微智联科技有限公司'*/) {

    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.entities.removeAll();
    }

    this.initVtouchLOGO();

    if (!address) {
      return;
    }

    API.fetchBaiduMap(address).then((data) => {
      Config.debug && console.log(data);

      if (data.status === 0) {

        let changeCamera = true;
        const length = 1;// data.results.length;
        for (let i = 0; i < length; i++) {
          let point = data.results[i];
          if (point.location) {
            this.address({
              x: point.location.lng - 0.01205,//0.01205、0.00370
              y: point.location.lat - 0.00370,
            } as Cesium.Cartesian2, point.name, point.address, changeCamera);
            changeCamera = false;
          }
        }
      }
    });
  }

  public address = (position: Cesium.Cartesian2, name: string, address: string, changeCamera: boolean) => {

    const longitude = position.x;
    const latitude = position.y;

    const option = {
      // position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
      name: name,
      position: Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        mapConfig.horizon * 20),
      billboard: {
        // image: fireOption.ionSrc,
        image: require('@/assets/map/localtion.png'),
        // image: require('@/assets/map/vtouch.png'),
        scale: 0.10,
        height: 256,//* 2,
        width: 256,//* 2,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 99999999999999),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: name,//+ address,
        // font: '15pt monospace',//24px
        font: '15pt Microsoft YaHei',//24px
        fillColor: Cesium.Color.RED,
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        // pixelOffset: new Cesium.Cartesian2(225000, 99999999),
        pixelOffset: new Cesium.Cartesian2(0, 32),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 225000),
      },
      // point: {
      //   pixelSize: 12,
      //   color: Cesium.Color.RED,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 99999999999999),
      // },
    }


    if (this.viewer) {
      const entity = this.viewer.entities.add(option);
      // this.hander(entity);
      if (changeCamera && this.viewer) {
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            mapConfig.fireHeight
          ),
        });
      }

      this.cameraUpdate(entity);
    }

  }

  public cameraUpdate(target: Cesium.Entity) {
    const showLocal = new controlRange();
    showLocal.mapZoomToTarget(target);
  };

  public hander(entity: Cesium.Entity) {

    // const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas as HTMLCanvasElement);
    if (this.handler) {
      this.handler.setInputAction((movement: Cesium.Cartesian2) => {
        var pickedObject = this.viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && (pickedObject.id === entity)) {
          // fireOption.handleEvent(fireOption.item);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
};