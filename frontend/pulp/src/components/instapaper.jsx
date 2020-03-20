import React, { Component } from "react";
import { timeAgo } from "./time_ago.js";
import { Instapaper_Pane } from "./components.jsx";

export default class Instapaper extends Component {
	render() {
		return (
			<div>
				{this.props.instapaper.signed_in ? (
					<div className="sync-date">
						Last synced:{" "}
						{timeAgo(this.props.instapaper.last_polled)}
						<button onClick={this.syncInstapaper}>
							<img src="../static/icons/sync.svg" />
						</button>
					</div>
				) : (
					<div className="sync-date">
						Click to integrate Instapaper
					</div>
				)}
				<Instapaper_Pane />
			</div>
		);
	}
}
