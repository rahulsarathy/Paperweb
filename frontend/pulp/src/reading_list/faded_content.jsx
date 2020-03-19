import React, { Component } from "react";

export default class FadedContent extends Component {
	render() {
		return (
			<div className="faded-content">
				<div className="content">
					<p>{this.props.parsed_text}</p>
				</div>
				<div className="gradient"></div>
			</div>
		);
	}
}
