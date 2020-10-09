import React from 'react';
import {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util} from 'bizcharts';
import DataSet from '@antv/data-set';

/**
 * Description of props
 *
 * @data
 * {
 *    date: "09/10/2019",
 *    orderType: "Booked",
 *    count: 7
 *  }
 *  @dataX
 *  name of atrr date
 *  @dataY
 *  name of atrr count
 *  @dataLine
 *  name of atrr orderType
 */

type Prop = {
  data?: any;
  dataX?: any;
  dataY?: any;
  dataLine?: any;
};

const PieChart = (props: Prop) => {
  const {data, dataX, dataY, dataLine} = props;
  const {DataView} = DataSet;

  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: val => {
        const roundData: any = `${parseFloat(String(val * 100)).toFixed(2)}%`;
        return roundData;
      },
    },
  };

  return (
    <Chart renderer="svg" padding={['auto', 'auto']} height={300} data={dv} scale={cols} forceFit>
      <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
      <Axis name="percent" />
      <Legend />
      <Tooltip
        showTitle={false}
        itemTpl="<li><span style='background-color:{color};' class='g2-tooltip-marker'></span>{name}: {value}</li>"
      />
      <Geom
        type="intervalStack"
        position="percent"
        color="item"
        tooltip={[
          'item*percent',
          (item, percent) => {
            const roundData: any = `${parseFloat(String(percent * 100)).toFixed(2)}%`;
            return {
              name: item,
              value: roundData,
            };
          },
        ]}
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
      ></Geom>
    </Chart>
  );
};

export default PieChart;
