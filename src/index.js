"use strict";

const React = require("react");
const {createRoot} = require("react-dom/client");

const useSpecialEvents = require("./special-events");
const Clock = require("./clock");

require("./style.css");

function App() {
	const [config, setConfig] = React.useState({clocks: [], networked: false});
	const [date, setDate] = React.useState(new Date());
	const [hasNetwork, setNetwork] = React.useState(true);

	const event = useSpecialEvents(date);

	React.useEffect(() => {
		const id = setInterval(() => {
			setDate(new Date());
		}, 200);

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

			console.log("ping");
			fetch("https://google.nl", {mode: 'no-cors'})
				.then((response) => {
					if (response.ok || response.type == "opaque") { // if blocked by CORS we're online
						setNetwork(true);
					} else {
						console.log(response.ok, response.type);
						setNetwork(false);
					}
					console.log("pong");
					setTimeout(ping, 30000);
				})
				.catch((e) => {
					console.error(e);
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
			{}
			{event.element}
			<div className={"clock-container " + event.className}>
				{config.clocks.map((clock, id) => {
					return (
						<Clock
							key = {id}
							legend = {clock.legend}
							offset = {clock.offset}
				
							date = {date}
						/>
					);
				})}
			</div>
      {!hasNetwork && (
				<div className="noping">
					Geen internetverbinding!<br/>
					Echte tijd kan afwijken van weergeven tijd
				</div>
			)}
			<h1>the wired</h1>
		</React.Fragment>
	);
}

const root = createRoot(document.getElementById("root"));
root.render(<App/>);
