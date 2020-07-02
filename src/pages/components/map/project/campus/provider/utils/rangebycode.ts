import { mapConfig } from 'vtouch-map';
import { MAPAPP } from '@/pages/components/map';
import * as Cesium from 'cesium';

import request from '@/utils/request';

export interface IRangeByCodeProp {
  adcode: string;
  full?: boolean;

  stroke?: Cesium.Color;
  fill?: Cesium.Color;
}

export async function getAnalysis(url: string): Promise<any> {
  return request(url, { method: 'get' });
}

export async function fetchWeather(url: string): Promise<any> {
  return fetch(url).then(res => res.json());
}

export class RangeByCode {
  public viewer: Cesium.Viewer;

  constructor(viewer: Cesium.Viewer, prop: IRangeByCodeProp) {
    this.viewer = viewer;

    const full = prop.full ? '_full' : '';
    const entity = this.viewer.dataSources.add(
      Cesium.GeoJsonDataSource.load(
        'https://geo.datav.aliyun.com/areas_v2/bound/' +
          prop.adcode +
          full +
          '.json',
        // "https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json",
        // "https://geo.datav.aliyun.com/areas_v2/bound/440000_full.json",
        // "https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json",
        {
          // stroke: Cesium.Color.HOTPINK,
          stroke: prop.stroke,
          // fill: Cesium.Color.PINK.withAlpha(0.5),
          fill: prop.fill,
          strokeWidth: 3,
          markerSize: 5.0,
          markerSymbol: 'NIHAO',
          markerColor: Cesium.Color.GREEN.withAlpha(0.5),
          // clampToGround: true,
        },
      ),
    );

    // getAnalysis('https://geo.datav.aliyun.com/areas_v2/bound/' + prop.adcode + full + '.json').then(res => {
    fetchWeather(
      'https://geo.datav.aliyun.com/areas_v2/bound/' +
        prop.adcode +
        full +
        '.json',
    ).then(res => {
      console.log(res);
    });

    return entity;

    // }
  }
}
