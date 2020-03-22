import React, { Component } from "react";

import { Pocket_Modal } from "./components.jsx";
import { timeAgo } from "./time_ago.js";

export default class Pocket extends Component {
	render() {
		if (!this.props.pocket.signed_in) {
			return (
				<div>
					<div className="sync-date">Click to integrate Pocket</div>
					<Pocket_Modal
						removePocket={this.props.removePocket}
						signed_in={this.props.pocket.signed_in}
					/>
				</div>
			);
		}
		if (this.props.pocket.invalid) {
			return (
				<div className="sync-date">
					Invalid pocket credentials. Click to fix.
					<Pocket_Modal />
				</div>
			);
		}
		return (
			<div>
				<div className="sync-date">
					Pocket last synced: {timeAgo(this.props.pocket.last_polled)}
					<button onClick={this.props.syncPocket}>
						<img src="../static/icons/sync.svg" />
					</button>
				</div>

				<Pocket_Modal
					removePocket={this.props.removePocket}
					signed_in={this.props.pocket.signed_in}
				/>
			</div>
		);
	}
}
