import React from 'react';
import {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util} from 'bizcharts';

/**
 * Description of props
 *
 * @data
 * {
 *   date: "09/10/2019",
 *   orderType: "Booked",
 *   count: 7
 *   }
 *  @dataX
 *  name of atrr date
 *  @dataY
 *  name of atrr count
 *  @dataLine
 *  name of atrr orderType
 */
type Prop = {
  data: any;
  dataX: any;
  dataY: any;
  dataLine: any;
};

const LineChart = (props: Prop) => {
  const {data, dataX, dataY, dataLine} = props;

  const cols = {
    [dataX]: {
      range: [0, 1],
    },
  };

  return (
    <Chart renderer="svg" padding={['auto', 'auto']} height={300} data={data} scale={cols} forceFit>
      <Legend />
      <Axis name={`${dataX}`} />
      <Axis
        name={`${dataY}`}
        label={{
          formatter: val => `${val}`,
        }}
      />
      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />
      <Geom type="line" position={`${dataX}*${dataY}`} size={2} color={`${dataLine}`} shape={'smooth'} />
      <Geom
        type="point"
        position={`${dataX}*${dataY}`}
        size={4}
        shape={'circle'}
        color={`${dataLine}`}
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
      />
    </Chart>
  );
};

export default LineChart;
