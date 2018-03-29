import React from 'react';
import ReactDOM from 'react-dom';
import '../style.css';
var create = require('create-react-class');

var App = create({
  render: function() {
    return (
      <Clocks />
    );
  }
})

var Clocks = create({
  getInitialState: function() {
    return {date: new Date};
  },

  update: function() {
    this.setState({
      date: new Date()
    });
  },

  componentDidMount: function() {
    this.timer = setInterval(
      () => this.update(),
      200
    );
  },

  componentWillUnmount: function() {
    clearInterval(this.timer);
  },

  render: function() {
    return (
      <div className="clocks">
        <Clock date={this.state.date}/>
        <Clock date={this.state.date} offset="-4"/>
        <Clock date={this.state.date} offset="local"/>
      </div>
    );
  }
})

var Clock = create({
  getInitialState: function() {
    let offset = this.props.offset;
    if (this.props.offset == "local") {
      offset = this.props.date.getTimezoneOffset()/60 * -1;
    }
    return {
      offset: offset
    };
  },

  render: function() {
    const date = this.props.date;
    let time = utc(date, this.state.offset);
    return (
      <div className="clock">
        <div className="digital">{pad(time[0])}:{pad(time[1])}:{pad(time[2])}</div>
        <AnalogClock time={time} />
      </div>
    );
  }
})

var AnalogClock = create({
  componentDidMount: function() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillRect(0,0, 300, 300);
  },

  render: function() {
    return (
      <canvas ref="canvas" width={300} height={300} />
    );
  }
})

function utc(date, offset) { //offset is in hours, relative to UTC
  if (offset == undefined) {
    offset = 0;
  }
  let offsetDate = new Date;
  offsetDate.setTime(date.getTime() + offset * 3600000);
  let hours = offsetDate.getUTCHours();
  let minutes = offsetDate.getUTCMinutes();
  let seconds = offsetDate.getUTCSeconds();
  return [hours, minutes, seconds];
}

function pad(fragment) {
  return fragment.toString().padStart(2, "0");
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
