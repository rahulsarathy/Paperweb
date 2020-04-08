import React, { Component } from "react";

export default class MiniMap extends Component {
	render() {
		let { offset, height, total_height } = this.props;
		let percent = height / total_height;

		let pixels = percent * height;

		let scaled = offset / total_height;

		let header = 100 * percent;

		// let final = (header + this.props.offset) * percent;
		let final = offset * percent;

		// if (final + pixels > this.props.height) {
		// }
		let style = {
			height: pixels + "px",
			top: final + "px",
		};
		return (
			<div className="minimap">
				<div style={style} className="viewport"></div>
				<img src="/static/images/stratechery.png" />
			</div>
		);
	}
}
