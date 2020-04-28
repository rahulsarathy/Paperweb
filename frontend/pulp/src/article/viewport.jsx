import React, { Component } from "react";

export default class Viewport extends Component {
	render() {
		return (
			<div
				style={this.props.style}
				className="viewport"
				id="viewport"
				onMouseEnter={this.props.handleLeave}
				onMouseLeave={this.props.handleEnter}
				onMouseDown={this.props.handleMouseDown}
				onMouseUp={this.props.handleMouseUp}
			></div>
		);
	}
}
