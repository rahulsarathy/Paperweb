import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import shortid from "shortid";
import {} from "./components.jsx";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export default class Twitter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	startTwitter() {
		axios.post(`../api/twitter/start_authentication/`).then((res) => {
			let data = res.data;
			console.log(data);

			let redirectURL =
				"https://api.twitter.com/oauth/authorize?oauth_token=" +
				data.oauth_token;
			// +
			// "&oauth_verifier=" +
			// data.secret;

			window.location.replace(redirectURL);
		});
	}

	getTimeline() {
		axios.get(`../api/twitter/get_timeline/`).then((res) => {
			let data = res.data;
			console.log(data);
		});
	}

	render() {
		return (
			<div className="twitter">
				<div className="elements">
					<h1>Twitter</h1>
					<button
						className="twitter-button"
						onClick={this.startTwitter}
					>
						Integrate with Twitter
					</button>
					<button
						className="timeline-button"
						onClick={this.getTimeline}
					>
						Get Timeline
					</button>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Twitter />, document.getElementById("twitter"));
