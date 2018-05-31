import React from 'react';
import ReactDOM from 'react-dom';
import '../style.css';
var create = require('create-react-class');

const SnowStorm = require('react-snowstorm');

const piday = require('../assets/event/pi.png');
const vuurwerk = require('../assets/event/fireworks.jpg');
const halloween = require('../assets/event/halloween.jpg');
const sintTile = require('../assets/event/sint-tile.png');
const kerst = require('../assets/event/kerst.png');

var App = create({
  getInitialState: function() {
    return ({
      json: [],
      ping: false
    });
  },

  componentDidMount: function() {
    this.getSettings();
    this.ping();
  },

  getSettings: function() {
    fetch("config.json")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({json: responseJson});
      })
      .catch(() => {
        setTimeout(this.getSettings, 200);
      })
  },

  ping: function() {
    console.log("ping");
    fetch("https://google.nl", {mode: 'no-cors'}) //CORS will be blocked by browser
      .then((response) => {
        if (!response.ok && response.type != "opaque") { //if blocked by CORS we're online
          this.setState({ping: false});
        }
        else {
          this.setState({ping: true});
        }
        console.log("pong");
        setTimeout(this.ping, 30000) //check again in 30sec
      })
      .catch((error) => {
        this.setState({ping: false});
        setTimeout(this.ping, 5000) //check again in 5sec
      })
  },

  getCurrentEvent: function() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Option for json with birthdays?

    if ((month == 12 && day == 31) || (month == 1 && day == 1)) { //oud&nieuw
      return (
        //<video src={vuurwerk} id="bg" className="darken" nocontrols="true" loop="true" autoplay="true" />
        <img src={vuurwerk} id="bg" className="darken"/>
      );
    }

    if (month == 3 && day == 14) { // pi day
      return (
        <img src={piday} id="bg" className="darken"/>
      );
    }

    if (month == 10 && day == 31) { // halloween
      return (
        <img src={halloween} id="bg"/>
      );
    }

    if (month == 12 && day == 5) { // sinterklaas
      return (
        //<img src={sinterklaas} id="bg" className="darken"/>
        <div id="bg" className="darken" style={{backgroundImage: `url(${sintTile})`}} />
      );
    }

    if (month == 12 && (day == 23 || day == 24 || day == 25)) { // kerst
      return (
        <React.Fragment className="darken">
          <img src={kerst} id="bg"/>
          <SnowStorm snowStick={false} useTwinkleEffect={false} followMouse={false} snowCharacter="#"/>
        </React.Fragment>
      );
    }

    if (month == 12 && day > 15) {
      return (
        <SnowStorm snowStick={false} useTwinkleEffect={false} followMouse={false} snowCharacter="#"/>
      );
    }

    return null;
  },

  render: function() {
    let clocks, ping, event, eventClass;
    if (this.state.json != undefined) {
      clocks = <Clocks json={this.state.json}/>;
    }

    if (!this.state.ping) {
      ping = <div className="noping">Geen internetverbinding!<br/>Echte tijd kan afwijken van weergeven tijd</div>
    }

    let currentEvent = this.getCurrentEvent();
    if (currentEvent != null) {
      let content;
      event = (
        <div className="event">
          {currentEvent}
        </div>
      );
      eventClass = currentEvent.props.className;
    }
    
    return (
      <React.Fragment>
        {event}
        <div className={eventClass}>
          {clocks}
          {ping}
        </div>
        <h1>the wired</h1>
      </React.Fragment>
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
    let clocks = this.props.json.map((clock, id) => {
      return (
        <Clock
          legend={clock.legend}
          date={this.state.date}
          offset={clock.offset}
          key={id}
          totalAmount={this.props.json.length}
        />
      );
    });
    return (
      <div className="clocks">
        {clocks}
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
        <AnalogClock time={time} size={document.getElementsByTagName('body')[0].clientWidth/this.props.totalAmount-50} legend={this.props.legend}/>
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
          stroke="#1e1e1e" strokeWidth="11" />
        <line x1={half} y1={half} x2={hour_x_contra} y2={hour_y_contra}
          stroke="#1e1e1e" strokeWidth="10" />
        <circle cx={hour_x} cy={hour_y}
          r={4} stroke="#1e1e1e" fill="#1e1e1e" />

        <line x1={half} y1={half} x2={min_x} y2={min_y}
          stroke="#1e1e1e" strokeWidth="10" />
        <line x1={half} y1={half} x2={min_x_contra} y2={min_y_contra}
          stroke="#1e1e1e" strokeWidth="10" />
        <circle cx={min_x} cy={min_y}
          r={4} stroke="#1e1e1e" fill="#1e1e1e" />

        <line x1={half} y1={half} x2={sec_x} y2={sec_y}
          stroke="red" strokeWidth="4" />
        <line x1={half} y1={half} x2={sec_x_contra} y2={sec_y_contra}
          stroke="red" strokeWidth="4" />
        <circle cx={sec_x} cy={sec_y}
          r={1.5} stroke="red" fill="red" />

        <circle cx={half} cy={half} r={12} stroke="#1e1e1e" fill="#1e1e1e" />
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
