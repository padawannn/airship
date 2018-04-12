import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { line, curveCatmullRom } from 'd3-shape';
import { scaleTime, scaleLinear } from 'd3-scale';
import { select, selectAll } from 'd3-selection'; // eslint-disable-line
import { transition } from 'd3-transition'; // eslint-disable-line
import { min, max } from 'd3-array';
import { axisBottom, axisLeft, axisRight } from 'd3-axis';
import { timeParse } from 'd3-time-format';
import { timeDay } from 'd3-time';
import { chartColors } from '../../constants';

const Svg = styled.svg`
  max-width: 248px;

  .leftAxis,
  .rightAxis {
    .tick line {
      opacity: 0.3;
    }
  }

  .bottomAxis .tick {
    line {
      display: none;
    }
  }

  .domain {
    opacity: 0.3;
  }

  text {
    color: ${props => props.textColor};
  }
`;

class LineChart extends Component {
  static defaultProps = {
    colors: chartColors,
    data: [],
    textColor: '#747474',
    width: 198,
    height: 140,
    margin: {
      top: 15,
      right: 30,
      bottom: 30,
      left: 20,
    },
  };

  static propTypes = {
    colors: PropTypes.array,
    data: PropTypes.array,
    height: PropTypes.number,
    margin: PropTypes.object,
    textColor: PropTypes.string,
    width: PropTypes.number,
  };

  componentDidMount() {
    const { margin } = this.props;

    this.linesContainer = this.container
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.parseData();
    this.renderAxis();
    this.renderLines();
  }

  componentDidUpdate() {
    this.parseData();
    this.updateAxis();
    this.renderLines();
  }

  parseData() {
    const parseTime = timeParse('%Y/%m/%d');
    this.data = this.props.data.map(item => ({
      ...item,
      values: item.values.map(d => ({
        ...d,
        date: parseTime(d.date),
        close: +d.close,
      })),
    }));
  }

  // TODO
  // updateAxis() {
  // }

  renderAxis() {
    const { height, margin, width } = this.props;

    // -- X Axis
    this.xScale = scaleTime()
      .domain([
        min(this.data, item => min(item.values, d => d.date)),
        max(this.data, item => max(item.values, d => d.date)),
      ])
      .range([0, width]);

    this.xAxis = axisBottom(this.xScale)
      .ticks(timeDay.every(3))
      .tickSize(5)
      .tickSizeOuter(0);

    this.xAxisSelection = this.container
      .append('g')
      .attr('class', 'bottomAxis')
      .attr('transform', `translate(${margin.left}, ${height + margin.top + 10})`)
      .call(this.xAxis);

    // -- Y Axis
    this.yScale = scaleLinear()
      .domain([
        min(this.data, item => min(item.values, d => d.close)),
        max(this.data, item => max(item.values, d => d.close)) + 10,
      ])
      .range([height, 0]);

    this.yAxisLeft = axisLeft(this.yScale)
      .tickSize(-width, 0, 0)
      .ticks(6);

    this.yAxisRight = axisRight(this.yScale)
      .ticks(6);

    this.yAxisLeftSelection = this.container
      .append('g')
      .attr('class', 'leftAxis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(this.yAxisLeft);

    select('.leftAxis .domain').remove();

    this.yAxisRightSelection = this.container
      .append('g')
      .attr('class', 'rightAxis')
      .attr('transform', `translate(${width + margin.left}, ${margin.top})`)
      .call(this.yAxisRight);

    select('.rightAxis .domain').remove();
  }

  renderLines() {
    const { colors } = this.props;

    this.line = line()
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.close))
      .curve(curveCatmullRom.alpha(0.5));

    this.linesContainer
      .selectAll('.line')
      .data(this.data)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', d => this.line(d.values))
      .style('stroke', (d, i) => colors[i])
      .style('stroke-width', 2)
      .style('fill', 'none');
  }

  render() {
    const { width, height, margin, ...others } = this.props;
    const fullHeight = height + margin.top + margin.bottom;
    const fullWidth = width + margin.left + margin.right;

    return (
      <Svg
        width={fullWidth}
        height={fullHeight}
        innerRef={node => { this.container = select(node); }}
        {...others}
      />
    );
  }
}

export default LineChart;
