import React, { Component } from "react";

export default class Progress extends Component {
	render() {
		let { offset, total_height, height } = this.props;

		let percent = (offset / (total_height - height)) * 100;

		let style = {
			height: percent + "%",
		};

		return <div style={style} className="article-progress"></div>;
	}
}
