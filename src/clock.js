"use strict";

const React = require("react");

function timeWithOffset(date, offset = 0) {
	let offsetDate = new Date(date.getTime() + (offset * 60 * 60 * 1000));

	return {
		hours: offsetDate.getUTCHours(),
		mins: offsetDate.getUTCMinutes(),
		secs: offsetDate.getUTCSeconds()
	};
}

function pad(fragment) {
	return fragment.toString().padStart(2, "0");
}

function AnalogClock({time, name}) {
	let hour_x = Math.cos((time.hours-3 + (time.mins/60))/6*Math.PI) * (35);
	let hour_y = Math.sin((time.hours-3 + (time.mins/60))/6*Math.PI) * (35);

	let hour_x_contra = Math.cos((time.hours-3 + (time.mins/60))/6*Math.PI - Math.PI) * 10;
	let hour_y_contra = Math.sin((time.hours-3 + (time.mins/60))/6*Math.PI - Math.PI) * 10;

	let min_x = Math.cos((time.mins-15 + (time.secs/60))/30*Math.PI) * 70;
	let min_y = Math.sin((time.mins-15 + (time.secs/60))/30*Math.PI) * 70;

	let min_x_contra = Math.cos((time.mins-15 + (time.secs/60))/30*Math.PI - Math.PI) * 15;
	let min_y_contra = Math.sin((time.mins-15 + (time.secs/60))/30*Math.PI - Math.PI) * 15;

	let sec_x = Math.cos((time.secs-15)/30*Math.PI) * 75;
	let sec_y = Math.sin((time.secs-15)/30*Math.PI) * 75;

	let sec_x_contra = Math.cos((time.secs-15)/30*Math.PI - Math.PI) * 10;
	let sec_y_contra = Math.sin((time.secs-15)/30*Math.PI - Math.PI) * 10;

	return (
		<svg className={"analog " + name} viewBox="-100 -100 200 200">
			<line x1={0} y1={0} x2={hour_x} y2={hour_y}
				stroke="#1e1e1e" strokeWidth="3.8" />
			<line x1={0} y1={0} x2={hour_x_contra} y2={hour_y_contra}
				stroke="#1e1e1e" strokeWidth="3.8" />
			<circle cx={hour_x} cy={hour_y}
				r={1.35} stroke="#1e1e1e" fill="#1e1e1e" />

			<line x1={0} y1={0} x2={min_x} y2={min_y}
				stroke="#1e1e1e" strokeWidth="3.5" />
			<line x1={0} y1={0} x2={min_x_contra} y2={min_y_contra}
				stroke="#1e1e1e" strokeWidth="3.5" />
			<circle cx={min_x} cy={min_y}
				r={1.35} stroke="#1e1e1e" fill="#1e1e1e" />

			<line x1={0} y1={0} x2={sec_x} y2={sec_y}
				stroke="red" strokeWidth="1.4" />
			<line x1={0} y1={0} x2={sec_x_contra} y2={sec_y_contra}
				stroke="red" strokeWidth="1.4" />
			<circle cx={sec_x} cy={sec_y}
				r={0.3} stroke="red" fill="red" />

			<circle cx={0} cy={0} r={2.1} stroke="#1e1e1e" fill="#1e1e1e" />
		</svg>
	);
}

module.exports = function Clock({legend, date, offset}) {
	if (offset == "local") {
		offset = date.getTimezoneOffset() / 60 * - 1;
	}

	const time = timeWithOffset(date, offset);

	return (
		<div className="clock">
			<div className="legend">{legend}</div>
			<AnalogClock time={time} name={legend}/>
			<div className="digital">{pad(time.hours)}<span className="gray">:{pad(time.mins)}</span></div>
		</div>
	);
};
