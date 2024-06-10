"use strict";

const React = require("react");
const SnowStorm = require("react-snowstorm").default;
const { gregorianEaster } = require("date-easter");

function useEaster(date) {
	return React.useMemo(() => {
		const easter = gregorianEaster(date.getFullYear());
		const easter2 = new Date(new Date(easter).getTime() - (new Date().getTimezoneOffset()) + (24 * 60 * 60 * 1000));

		return {
			day1: easter,
			day2: {
				month: easter2.getMonth() + 1,
				day: easter2.getDate()
			}
		}
	}, [date.getFullYear()]);
}

module.exports = function useEvents(date) {
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const easter = useEaster(date);

	let image = "";
	let darken = false;
	let tiling = false;
	let withSnow = false;

	if ((month == 12 && day == 31) || (month == 1 && day == 1)) { // oud & nieuw
		darken = true;
		image = "newyear.jpg";
	} else if (month == 3 && day == 14) { // pi day
		image = "pi.png";
	} else if ((month == easter.day1.month && day == easter.day1.day) || (month == easter.day2.month && day == easter.day2.day)) {
		darken = true;
		image = "easter.jpg";
	} else if ((month == 10 && day == 31)) { // halloween
		image = "halloween.jpg";
	} else if (month == 12 && day == 5) { // sinterklaas
		darken = true;
		tiling = true;
		image = "sint-tile.png";
	} else if (month == 12 && (day == 23 || day == 24 || day == 25 || day == 26)) { // kerst
		darken = true;
		image = "kerst.png";
		withSnow = true;
	} else if (month == 12 && day > 15) {
		withSnow = true;
	}

	let element = null;

	if (image != "") {
		const url = `/special-bg/${image}`;
		if (tiling) {
			element = <div className="bg" style={{backgroundImage: `url(${url})`}} />
		} else {
			element = <img className="bg" src={url}/>
		}
	}

	if (withSnow) {
		element = (
			<React.Fragment>
				{element}
				<SnowStorm
					snowStick={false}
					useTwinkleEffect={false}
					followMouse={false}
					animationInterval={50}
				/>
			</React.Fragment>
		);
	}

	return {
		element,
		className: darken ? "darken" : ""
	};
}
