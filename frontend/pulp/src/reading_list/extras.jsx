import React, { Component } from "react";
import { Author } from "./components.jsx";

export default class Extras extends Component {
	constructor(props) {
		super(props);
		this.state = {
			host: ""
		};
	}

	getLocation() {
		var l = document.createElement("a");
		l.href = this.props.permalink;
		this.setState({
			host: l.hostname
		});
	}

	componentDidMount() {
		this.getLocation();
	}

	render() {
		return (
			<div className="extras">
				<div className="domain">
					<a target="_blank" href={this.props.permalink}>
						{this.state.host}
					</a>
				</div>
				<Author author={this.props.author} />
			</div>
		);
	}
}
