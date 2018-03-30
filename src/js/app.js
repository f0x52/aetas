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
        <Clock legend="UTC" date={this.state.date}/>
        <Clock legend="Carribean Time" date={this.state.date} offset="-4"/>
        <Clock legend="Local" date={this.state.date} offset="local"/>
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
        <AnalogClock time={time} size={document.getElementsByTagName('body')[0].clientWidth/3-50} />
        <div className="digital">{pad(time[0])}:{pad(time[1])}</div>
        <div className="legend">{this.props.legend}</div>
      </div>
    );
  }
})

var AnalogClock = create({
  render: function() {
    let time = this.props.time;
    let size = this.props.size;
    let half = size/2;

    let hour_x = half-8 + Math.cos((time[0]-3 + (time[1]/60))/6*Math.PI) * (half*0.5);
    let hour_y = half-8 + Math.sin((time[0]-3 + (time[1]/60))/6*Math.PI) * (half*0.5);

    let min_x = half-6 + Math.cos((time[1]-15 + (time[2]/60))/30*Math.PI) * (half*0.7);
    let min_y = half-6 + Math.sin((time[1]-15 + (time[2]/60))/30*Math.PI) * (half*0.7);

    let sec_x = half-4 + Math.cos((time[2]-15)/30*Math.PI) * (half*0.85);
    let sec_y = half-4 + Math.sin((time[2]-15)/30*Math.PI) * (half*0.85);

    return (
      <svg className="analog" height={size} width={size}>
        <line x1={half} y1={half} x2={hour_x} y2={hour_y}
          stroke="black" strokeWidth="16" />
        <circle cx={hour_x} cy={hour_y}
          r={7} stroke="black" fill="black" />

        <line x1={half} y1={half} x2={min_x} y2={min_y}
          stroke="black" strokeWidth="12" />
        <circle cx={min_x} cy={min_y}
          r={5} stroke="black" fill="black" />

        <line x1={half} y1={half} x2={sec_x} y2={sec_y}
          stroke="red" strokeWidth="8" />
        <circle cx={sec_x} cy={sec_y}
          r={3} stroke="red" fill="red" />

        <circle cx={half} cy={half} r={16} stroke="black" fill="black" />
      </svg>
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
