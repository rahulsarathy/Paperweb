import React, { Component } from "react";

export default class HoverViewport extends Component {
	constructor(props) {
		super(props);

		this.handleMouseMove = this.handleMouseMove.bind(this);

		this.state = {
			yPos: 0,
		};
	}

	handleMouseMove(e) {
		// console.log("prevent default");
		this.setState({
			yPos: e.clientY,
		});
		e.preventDefault();
	}

	render() {
		let { viewport_size, yPos } = this.props;
		// let { yPos } = this.state;

		let preview_top = yPos - viewport_size / 2;

		let preview_style = {
			top: preview_top,
			height: viewport_size,
		};

		return (
			<div>
				{this.props.show_hover && !this.props.down ? (
					<div
						id="hover-viewport"
						onClick={this.props.onClick}
						style={preview_style}
						className="hover-viewport"
					></div>
				) : (
					<div id="no-hover"></div>
				)}
			</div>
		);
	}
}
