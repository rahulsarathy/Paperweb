import React, { Component } from "react";

export default class Zoom extends Component {
	render() {
		let { scale, minimap_scroll, createArticle } = this.props;

		return (
			<div
				className="zoom"
				style={{
					transform: "scale(" + scale + ")",
					top: "-" + minimap_scroll + "px",
				}}
			>
				{createArticle()}
			</div>
		);
	}
}
