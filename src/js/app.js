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
        <Clock legend="Caribbean" date={this.state.date} offset="-4"/>
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
        <div className="legend">{this.props.legend}</div>
        <AnalogClock time={time} size={document.getElementsByTagName('body')[0].clientWidth/3-50} legend={this.props.legend}/>
        <div className="digital">{pad(time[0])}<span className="gray">:{pad(time[1])}</span></div>
      </div>
    );
  }
})

var AnalogClock = create({
  render: function() {
    let time = this.props.time;
    let size = this.props.size;
    let half = size/2;

    let hour_x = half + Math.cos((time[0]-3 + (time[1]/60))/6*Math.PI) * (half*0.35);
    let hour_y = half + Math.sin((time[0]-3 + (time[1]/60))/6*Math.PI) * (half*0.35);

    let hour_x_contra = half + Math.cos((time[0]-3 + (time[1]/60))/6*Math.PI - Math.PI) * (half*0.1);
    let hour_y_contra = half + Math.sin((time[0]-3 + (time[1]/60))/6*Math.PI - Math.PI) * (half*0.1);

    let min_x = half + Math.cos((time[1]-15 + (time[2]/60))/30*Math.PI) * (half*0.7);
    let min_y = half + Math.sin((time[1]-15 + (time[2]/60))/30*Math.PI) * (half*0.7);

    let min_x_contra = half + Math.cos((time[1]-15 + (time[2]/60))/30*Math.PI - Math.PI) * (half*0.15);
    let min_y_contra = half + Math.sin((time[1]-15 + (time[2]/60))/30*Math.PI - Math.PI) * (half*0.15);


    let sec_x = half + Math.cos((time[2]-15)/30*Math.PI) * (half*0.75);
    let sec_y = half + Math.sin((time[2]-15)/30*Math.PI) * (half*0.75);

    let sec_x_contra = half + Math.cos((time[2]-15)/30*Math.PI - Math.PI) * (half*0.1);
    let sec_y_contra = half + Math.sin((time[2]-15)/30*Math.PI - Math.PI) * (half*0.1);

    return (
      <svg className={"analog " + this.props.legend} height={size} width={size}>
        <line x1={half} y1={half} x2={hour_x} y2={hour_y}
          stroke="black" strokeWidth="11" />
        <line x1={half} y1={half} x2={hour_x_contra} y2={hour_y_contra}
          stroke="black" strokeWidth="10" />
        <circle cx={hour_x} cy={hour_y}
          r={4} stroke="black" fill="black" />

        <line x1={half} y1={half} x2={min_x} y2={min_y}
          stroke="black" strokeWidth="10" />
        <line x1={half} y1={half} x2={min_x_contra} y2={min_y_contra}
          stroke="black" strokeWidth="10" />
        <circle cx={min_x} cy={min_y}
          r={4} stroke="black" fill="black" />

        <line x1={half} y1={half} x2={sec_x} y2={sec_y}
          stroke="red" strokeWidth="4" />
        <line x1={half} y1={half} x2={sec_x_contra} y2={sec_y_contra}
          stroke="red" strokeWidth="4" />
        <circle cx={sec_x} cy={sec_y}
          r={1.5} stroke="red" fill="red" />

        <circle cx={half} cy={half} r={12} stroke="black" fill="black" />
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
