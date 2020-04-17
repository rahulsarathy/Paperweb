import React, { Component } from "react";

export default class Zoom extends Component {
	render() {
		let { scale, minimap_scroll, createArticle } = this.props;

		let offset = -1 * minimap_scroll;
		return (
			<div
				id="zoom"
				className="zoom"
				style={{
					transform: "scale(" + scale + ")",
					top: offset + "px",
				}}
			>
				{createArticle()}
			</div>
		);
	}
}
