
import fetchJsonp from 'fetch-jsonp';


// import http = require('http');

export class API {

  constructor() {

  }

  public static async fetchBaiduMap(address: string): Promise<any> {
    const baseUrl = 'http://api.map.baidu.com/place/v2/search?';
    const ak = 'cA1QlZ6PTePnOYyjDcBpjoA4nIL3Ejde';
    // const ak = 'BryvKfs3TG3GZoPXA7jmNZ4kd4tOPdRQ';
    // const address = 'http://api.map.baidu.com/place/v2/search?query=ATM机&tag=银行&region=北京&output=json&ak=cA1QlZ6PTePnOYyjDcBpjoA4nIL3Ejde';
    // const address1 = 'http://api.map.baidu.com/place/v2/search?query=京师幼儿园&region=广州市&output=json&ak=BryvKfs3TG3GZoPXA7jmNZ4kd4tOPdRQ';

    // baseUrl + 'location=39,116&amp;output=json&amp;ak=您的ak'

    const url = [
      baseUrl,
      'query=',
      address,
      '&region=',
      '中国',
      '&output=json&ak=',
      ak,
    ].join('');

    return fetchJsonp(url, {
      // method: 'GET',
      // mode: 'no-cors',
      // credentials: 'include', // 解决跨域问题
      // headers: {
      //     // 'Accept': 'application/json, text/plain, */*',
      //     'Content-Type': 'application/json; charset=utf-8',
      //     // 'Cache-Control': ' no-cache',
      // },
      // jsonCallbackFunction: 'showLocation',

    }).then((res: any) => res.json());
  }

}
