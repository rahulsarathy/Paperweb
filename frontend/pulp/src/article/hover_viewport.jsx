import React, { Component } from "react";

export default class HoverViewport extends Component {
	render() {
		return (
			<div>
				{this.props.show && !this.props.down ? (
					<div
						onClick={this.props.onClick}
						style={this.props.style}
						className="hover-viewport"
					></div>
				) : (
					<div></div>
				)}
			</div>
		);
	}
}
