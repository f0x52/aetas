"use strict";

const React = require("react");
const { createRoot } = require("react-dom/client");
const sAgo = require("s-ago");

const useSpecialEvents = require("./special-events");
const Clock = require("./clock");

require("./style.css");

function App() {
	const [config, setConfig] = React.useState({ clocks: [], networked: false });
	const [date, setDate] = React.useState(new Date());
	const [hasNetwork, setNetwork] = React.useState(true);
	const [lastPing, setLastPing] = React.useState(null);

	const event = useSpecialEvents(date);

	React.useEffect(() => {
		const id = setInterval(() => {
			setDate(new Date());
		}, 100);

		return () => clearInterval(id);
	}, []);

	React.useEffect(() => {
		function fetchConfig() {
			fetch("./config.json")
				.then((res) => res.json())
				.then((json) => setConfig(json))
				.catch(() => {
					setTimeout(fetchConfig, 200);
				})
		}

		fetchConfig();
	}, []);

	React.useEffect(() => {
		function ping() {
			if (!config.networked) {
				return;
			}

			fetch("https://google.nl", { mode: 'no-cors' })
				.then((response) => {
					if (response.ok || response.type == "opaque") { // if blocked by CORS we're online
						setNetwork(true);
						setLastPing(new Date());
					} else {
						setNetwork(false);
					}
					setTimeout(ping, 30000);
				})
				.catch(() => {
					setNetwork(false);
					setTimeout(ping, 5000);
				});
		}

		if (config.networked) {
			ping();
		}
	}, [config.networked]);

	return (
		<React.Fragment>
			{event.element}
			<div className={"clock-container " + event.className}>
				{config.clocks.map((clock, id) => {
					return (
						<Clock
							key={id}
							legend={clock.legend}
							offset={clock.offset}
							date={date}
						/>
					);
				})}
			</div>
			{
				config.networked && (
					<div className="network">
						{hasNetwork
							? <div>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" /></svg>
								Connected
							</div>
							: <div className="error">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
									<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
									<line id="red" x1="160" y1="120" x2="480" y2="392" strokeLinecap="round" strokeWidth="50" />
								</svg>
								{lastPing ? <>Last connected: {sAgo(lastPing)}</> : "Not connected"}
							</div>
						}
					</div>
				)
			}
			<h1>the wired</h1>
		</React.Fragment>
	);
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
