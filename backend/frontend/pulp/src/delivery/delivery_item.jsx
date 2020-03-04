import React, { Component } from "react";
import { CheckBox } from "./components.jsx";

export default class DeliveryItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.checked !== this.props.checked;
	}

	render() {
		console.log("rendered");
		return (
			<div className="delivery-item">
				<Title title={this.props.title} />
				<ToDeliver
					changeDeliver={this.props.changeDeliver}
					checked={this.props.checked}
					permalink={this.props.permalink}
				/>
				<PageCount page_count={this.props.page_count} />
				<DateAdded date_added={this.props.date_added} />
			</div>
		);
	}
}

class ToDeliver extends Component {
	render() {
		return (
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
		);
	}
}

class Title extends Component {
	render() {
		return (
			<div className="article-title">
				<p>{this.props.title}</p>
			</div>
		);
	}
}

class DateAdded extends Component {
	render() {
		return (
			<div className="date-added">
				{new Date(this.props.date_added)
					.toDateString()
					.split(" ")
					.slice(1)
					.join(" ")}
			</div>
		);
	}
}

class PageCount extends Component {
	render() {
		return <div className="page-count">{this.props.page_count}</div>;
	}
}
