import React, { Component } from "react";

import { Pocket_Modal } from "./components.jsx";
import { timeAgo } from "./time_ago.js";

export default class Pocket extends Component {
	render() {
		return (
			<div>
				{this.props.pocket.signed_in ? (
					<div className="sync-date">
						Last synced: {timeAgo(this.props.pocket.last_polled)}
						<button onClick={this.syncPocket}>
							<img src="../static/icons/sync.svg" />
						</button>
					</div>
				) : (
					<div>Click to integrate Pocket</div>
				)}
				<Pocket_Modal />
			</div>
		);
	}
}
