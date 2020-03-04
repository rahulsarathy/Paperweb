import React, { Component } from "react";
import { CheckBox } from "./components.jsx";

export default class DeliveryRow extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		// if (nextProps.checked === this.props.checked) return false;
		console.log(
			this.props.checked + " current title is " + this.props.title
		);
		console.log(nextProps.checked + " new title is " + nextProps.title);

		return true;
	}

	render() {
		return (
			<div className="delivery-item">
				<div className="article-title">
					<p>{this.props.title}</p>
				</div>
				<div className="to-deliver">
					<CheckBox
						onChange={() =>
							this.props.changeDeliver(
								this.props.checked,
								this.props.permalink
							)
						}
						checked={this.props.checked}
					/>
				</div>
				<div className="page-count">{this.props.page_count}</div>
				<div className="date-added">
					{new Date(this.props.date_added)
						.toDateString()
						.split(" ")
						.slice(1)
						.join(" ")}
				</div>
			</div>
		);
	}
}
