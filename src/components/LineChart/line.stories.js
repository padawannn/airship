import React from 'react';
import { storiesOf } from '@storybook/react';
import LineChart from './line';
import Widget from '../Widget/widget';
import mockData from './line.fixtures';

const lessData = mockData.slice(0, 2);

class LineUpdated extends React.Component {
  state = {
    data: mockData,
  }

  changeState = () => {
    this.setState(prevState => ({
      data: prevState.data.length !== 2 ? lessData : mockData,
    }));
  }

  render() {
    return (
      <div>
        <LineChart data={this.state.data} />
        <button onClick={this.changeState}>Click me</button>
      </div>
    );
  }
}

storiesOf('Line Chart', module)
  .add('Default', () => (
    <LineChart data={mockData} />
  ))
  .add('Inside a widget', () => (
    <Widget>
      <Widget.Title>Suffer score</Widget.Title>
      <Widget.Description>Just a widget</Widget.Description>

      <LineChart data={mockData} />
    </Widget>
  ))
  .add('Without legend', () => (
    <Widget>
      <Widget.Title>Suffer score</Widget.Title>
      <Widget.Description>Just a widget</Widget.Description>

      <LineChart data={mockData} showLegend={false} />
    </Widget>
  ))
  .add('Updating data', () => (
    <Widget>
      <Widget.Title>Suffer score</Widget.Title>
      <Widget.Description>Just a widget</Widget.Description>

      <LineUpdated />
    </Widget>
  ));
