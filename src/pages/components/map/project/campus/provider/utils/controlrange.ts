import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { mapConfig, Cartesian3 } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig, Cartesian3 } from 'vtouch-map';
import { MAPAPP } from '../../../..';
import { Config } from '../..';


export class controlRange {

  public initViewPosition: Cartesian3 = {
    longitude: (113.38555758641153659028 + 113.37619198869344927516) / 2,
    latitude: (23.06252222671671958665 + 23.05573557122957595311) / 2,
    height: 15000,
  };

  public viewer?: Cesium.Viewer;

  public handler?: Cesium.ScreenSpaceEventHandler;

  public point = {};
  public zone = {};

  constructor() {

  }

  public createProvider = () => {
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.plugin.createProvider(Config.IDrawRange);
    }
  }

  public exitProvider = (campusList: [], showRangeIndex: number = 0) => {

    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.entities.removeAll();
      mapConfig.map.plugin.createProvider(Config.IRangeMap);
      mapConfig.map.viewer.scene.requestRender();
    }
    if (campusList.length) {
      // showRangeUpdate(campusList[campusList.length - 1]);
      this.showRangeUpdate(campusList[showRangeIndex]);
    }
  };

  public exit = () => {
    if (this.handler) {
      this.handler.destroy();
    }
  }

  public mapRequestRender = () => {
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.entities.removeAll();
      mapConfig.map.viewer.scene.requestRender();
    }
  }

  public mapZoomToTarget = (target: Cesium.Entity | Cesium.Entity[]) => {
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.flyTo(target, {
        duration: Config.animation.flyToTime,
        maximumHeight: Config.animation.flyHdight,
        offset: new Cesium.HeadingPitchRange(0, -1.57, 0),
      });
    }
  };

  public showAllRangeUpdate = (campusList: any[], showName: boolean = false) => {

    // Config.debug && console.log(campusList, 'campusList');
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.entities.removeAll();

      campusList.forEach((v, i) => {
        // Config.debug && console.log(v.i, JSON.parse(v.locationScope));
        if (!v || !v.locationPointer || !v.locationScope || JSON.parse(v.locationScope).app.range.length < 3) {
          return;
        }
        const point = v.locationPointer;
        const polygon = v.locationScope;
        if (mapConfig.map instanceof MAPAPP) {

          const range = JSON.parse(polygon);
          // console.log(range);
          const target = mapConfig.map.viewer.entities.add({
            // id:'';
            name: v.id + '_' + v.name,
            polygon: {
              hierarchy: this.dataToRange(JSON.parse(polygon)),
              // hierarchy: JSON.parse(polygon),
              // material: Config.rangeColor,
              // height: 1500,
              outline: true,
              // outlineColor: Config.rangeoutlineColor,
              outlineColor: Cesium.Color.RED,
              outlineWidth: 1.0,//windows 只能是  1.0
              material: Config.rangeFillMaterial,
            }
          });


          // const positions = [];
          // for (i = 0; i < 40; ++i) {
          //   positions.push(Cesium.Cartesian3.fromDegrees(-100.0 + i, 15.0));
          // }
          const positions = this.dataToRange(JSON.parse(polygon), true);
          // console.log(positions);
          let s = true;
          if (positions && s) {
            s = false;
            mapConfig.map.viewer.entities.add({
              polyline: {
                positions: positions,
                width: 20.0,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),

                material: new Cesium.PolylineGlowMaterialProperty({
                  // color: Cesium.Color.DEEPSKYBLUE,
                  color: Cesium.Color.fromCssColorString('#4BCAF8').withAlpha(1.0),
                  // color: Cesium.Color.YELLOW,
                  glowPower: 0.03,
                  taperPower: 1.0,
                }),

                // material: new Cesium.PolylineOutlineMaterialProperty({
                //   color: Cesium.Color.RED,
                //   outlineColor: Cesium.Color.GREEN,
                //   outlineWidth: 10.0,
                //   // color: Cesium.Color.fromCssColorString('#000000').withAlpha(0.26),
                //   // color: Cesium.Color.YELLOW,
                //   // glowPower: 0.05,
                //   // taperPower: 0.5,
                // }),

              },
            });
          }



          if (showName) {
            const point = this.dataToPoint(JSON.parse(polygon));

            mapConfig.map.viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(point.y, point.x, 0),
              // id:'';
              name: 'child',
              child: [target],
              label: {
                text: v.name,
                font: "15pt sans-serif",
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BASELINE,
                fillColor: Cesium.Color.WHITE,
                // showBackground: true,
                // backgroundColor: new Cesium.Color(1, 1, 0, 0.7),
                // backgroundColor: new Cesium.Color.fromCssColorString('#3199F2').withAlpha(0.76),
                // backgroundPadding: new Cesium.Cartesian2(8, 4),
                disableDepthTestDistance: Number.POSITIVE_INFINITY, // draws the label in front of terrain
                // scale: 0.5,
                // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 5.0e6, 0.0),
                scaleByDistance: new Cesium.NearFarScalar(0, 0.66, 30000, 0.8),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),
                // totalScale: 0.5,
                // scaleByDistance 
              },
              billboard: {
                // image: require('@/assets/map/model.png'),
                // heightReference: Cesium.HeightReference.CENTER,
              },
            });


            mapConfig.map.viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(point.y, point.x, 0),
              // id:'';
              name: 'child',
              child: [target],
              label: {
                text: v.name,
                font: "15pt sans-serif",
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BASELINE,
                fillColor: Cesium.Color.WHITE,
                showBackground: true,
                // backgroundColor: new Cesium.Color(1, 1, 0, 0.7),
                backgroundColor: new Cesium.Color.fromCssColorString('#3199F2').withAlpha(0.76),
                // backgroundPadding: new Cesium.Cartesian2(8, 4),
                disableDepthTestDistance: Number.POSITIVE_INFINITY, // draws the label in front of terrain
                // scale: 0.5,
                scaleByDistance: new Cesium.NearFarScalar(30000, 0.8, 5.0e6, 1.0),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(30000, 5.0e6),
                // totalScale: 0.5,
                // scaleByDistance 
              },
              billboard: {
                // image: require('@/assets/map/model.png'),
                // heightReference: Cesium.HeightReference.CENTER,
              },
            });

          }

          // Config.debug && console.log(target);
          // Config.debug && console.log(target);
        }
      });

      this.mapZoomToTarget(mapConfig.map.viewer.entities);
      mapConfig.map.viewer.scene.requestRender();
    }
  }

  public getPolygon = () => {



  };


  public showRangeUpdate = (campusList: {}, viewer?: Cesium.Viewer) => {
    if (!viewer) {
      if (mapConfig.map instanceof MAPAPP) {
        mapConfig.map.viewer.entities.removeAll();
        viewer = mapConfig.map.viewer;
      }
    }
    if (!campusList || !campusList.locationPointer || !campusList.locationScope || JSON.parse(campusList.locationScope).app.range.length < 3) {
      if (viewer) {
        this.viewer = viewer;
        this.cameraInit();
      }
      return;
    }

    const point = campusList.locationPointer;
    const polygon = campusList.locationScope;
    Config.debug && console.log(point, polygon);
    Config.debug && console.log(JSON.parse(point), JSON.parse(polygon));

    Config.debug && console.log(mapConfig.map);
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.entities.removeAll();
      Config.debug && console.log(mapConfig.map.viewer.entities);

      // const target = mapConfig.map.viewer.entities.add({
      //     name: "Red polygon on surface",
      //     polygon: {
      //         hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
      //             -90.0,
      //             41.0,
      //             0.0,
      //             -85.0,
      //             41.0,
      //             500000.0,
      //             -80.0,
      //             41.0,
      //             0.0,
      //         ]),
      //         material: Cesium.Color.RED,
      //     }
      // });

      // const range = JSON.parse(polygon);
      // const version = range.app.version;
      // console.log(range);

      // this.dataToRange(range, range.version);

      // if (range.version) {

      //   JSON.parse(polygon).forEach((v) => {
      //     arrayPoint.push(v.y);
      //     arrayPoint.push(v.x);
      //   });
      // }



      const target = mapConfig.map.viewer.entities.add({
        polygon: {
          // hierarchy: new Cesium.PolygonHierarchy(
          //   // Cesium.Cartesian3.fromDegreesArray(this.activeShapePoints)
          //   // this.activeShapePoints 
          //   Cesium.Cartesian3.fromDegreesArray(arrayPoint)
          // ),
          hierarchy: this.dataToRange(JSON.parse(polygon)),
          material: Config.rangeColor,
          // height: 1500,
          outline: true,
          outlineColor: Config.rangeoutlineColor,
          // outlineColor: Cesium.Color.BLUE,
          outlineWidth: 1.0,//windows 只能是  1.0
        }
      });
      Config.debug && console.log(target);

      this.mapZoomToTarget(target);

      mapConfig.map.viewer.scene.requestRender();

      // mapConfig.map.viewer.camera.flyTo({
      //     destination: Cesium.Cartesian3.fromDegrees(113, 23, 1500),
      //     // orientation: {
      //     //     direction: new Cesium.Cartesian3(0, 0, 0),
      //     //     up: new Cesium.Cartesian3(0, 0, 1),
      //     // },
      // });
    }
  }


  public cameraInit() {

    this.viewer && this.viewer.camera.flyTo({
      // destination: Cesium.Rectangle.fromDegrees(
      duration: Config.animation.flyToTime,
      destination: Cesium.Cartesian3.fromDegrees(

        // 113.37619198869344927516, 23.05573557122957595311,
        // 113.38555758641153659028, 23.06252222671671958665,

        this.initViewPosition.longitude,
        this.initViewPosition.latitude,
        this.initViewPosition.height,
      ),
      // complete: this.useDefaultRenderLoop,
    });

    // if (mapConfig.map instanceof MAPAPP) {
    //   mapConfig.map.viewer.scene.requestRender();

    // }
  }

  public dataToRange = (data: Cesium.cartesian3[] | object, array: boolean = false) => {

    if (data instanceof Array) {

      if (array) { return false; }

      return data;
    } else {
      const arrayPoint: number[] = [];
      const positions: number[] = [];
      data.app.range.forEach((v: Cesium.cartesian3) => {
        arrayPoint.push(v.y);
        arrayPoint.push(v.x);
        positions.push(Cesium.Cartesian3.fromDegrees(v.y, v.x));
      });

      if (array) {
        positions.push(positions[0]);
        positions.push(positions[1]);
        return positions;
      }
      // console.log(arrayPoint);
      return new Cesium.PolygonHierarchy(
        // Cesium.Cartesian3.fromDegreesArray(this.activeShapePoints)
        // this.activeShapePoints 
        Cesium.Cartesian3.fromDegreesArray(arrayPoint)
      );
    }
  };

  public dataToPoint = (data: Cesium.cartesian3[] | object) => {
    if (data instanceof Array) {

      if (mapConfig.map instanceof MAPAPP) {
        var ellipsoid = mapConfig.map.viewer.scene.globe.ellipsoid;
        // var cartesian3 = new Cesium.cartesian3(x, y, z);
        var cartesian3 = data[0];
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        // console.log(lat, lng, alt);
        return { x: lat, y: lng };
      }

    } else {
      return data.app.range[0];
    }

  };

}