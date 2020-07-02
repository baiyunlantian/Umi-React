import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });


export class Map {


  public viewer: Cesium.Viewer;
  public googleMap: Cesium.UrlTemplateImageryProvider;
  public mapboxMap: Cesium.MapboxStyleImageryProvider;

  constructor(viewer: Cesium.Viewer) {

    this.viewer = viewer;
    this._googleMap();
    this._mapboxMap();

  }

  public googleMapStatus(status: boolean = true) {
    this.googleMap.show = status;
  }

  public mapboxMapStatus(status: boolean = true) {
    this.mapboxMap.show = status;
  }

  private _googleMap = () => {
    //加载谷歌中国卫星影像，谷歌地球商业版，需要翻墙，报跨域资源请求错误
    // const url = "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali";
    // const url = "https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229";
    // const imageryProvider = new Cesium.UrlTemplateImageryProvider({ url: url });

    var esriImageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    });

    // this.googleMap = this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    this.googleMap = this.viewer.imageryLayers.addImageryProvider(esriImageryProvider);

    this.googleMapStatus(false);

  };

  private _mapboxMap = () => {
    //mapbox://styles/qq793931289/ckbkmo0k405hd1imf4i1qrh8w
    //mapbox://styles/qq793931289/ckblmjpog0kw51inybb6on53s
    const imageryProvider = new Cesium.MapboxStyleImageryProvider({
      url: 'https://api.mapbox.com/styles/v1',
      username: 'qq793931289',
      styleId: 'ckblmjpog0kw51inybb6on53s',
      accessToken: 'pk.eyJ1IjoicXE3OTM5MzEyODkiLCJhIjoiY2s5M3oxbmFzMDdrczNlbXpibDI0bTQxYiJ9.GuZhkGBTu6vkisVE7CKGeA',
      scaleFactor: true,
      // minimumLevel: 2,
      // maximumLevel: 20,
      hasAlphaChannel: false,
      tileHeight: 256,
      tileWidth: 256,
      tilesize: 256,
      // format: "image/jpeg",
      fileExtension: "jpeg",
      format: 'jpg',
    });

    this.mapboxMap = this.viewer.imageryLayers.addImageryProvider(imageryProvider);

    this.mapboxMapStatus(false);

  };


}