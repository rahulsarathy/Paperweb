import React, { Component } from "react";
import { SubHeaders } from "./components.jsx";

export default class MiniMapContent extends Component {
	render() {
		let { scale, minimap_scroll, createArticle, subheaders } = this.props;
		return (
			<div className="zoom-wrapper">
				<div
					className="zoom"
					style={{
						transform: "scale(" + scale + ")",
						top: "-" + minimap_scroll + "px",
					}}
				>
					{createArticle()}
				</div>

				<SubHeaders
					minimap_scroll={minimap_scroll}
					subheaders={subheaders}
				/>
			</div>
		);
	}
}
