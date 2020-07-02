import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts-liquidfill';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import echartsTheme from './macaron';
import ReactEcharts from 'echarts-for-react';

export default class echart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    echarts.registerTheme('Imoc', echartsTheme);
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ReactEcharts option={this.props.option} theme="Imooc" />
      </div>
    );
  }
}
