import React, { Component } from "react";
import { CheckBox } from "./components.jsx";
import { Spinner } from "../components/components.jsx";

const static_icon = "../static/icons/";

export default class DeliveryItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.checked !== this.props.checked;
	}

	render() {
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
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.checked !== this.props.checked) {
			this.setState({
				loading: false
			});
		}
	}

	startToggleDeliver() {
		this.setState(
			{
				loading: true
			},
			() =>
				this.props.changeDeliver(
					this.props.checked,
					this.props.permalink
				)
		);
	}

	render() {
		return (
			<div className="to-deliver">
				{this.state.loading ? (
					<div className="spinner">
						<Spinner scale={0.4} />
					</div>
				) : (
					<CheckBox
						onChange={() => this.startToggleDeliver()}
						checked={this.props.checked}
					/>
				)}
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
