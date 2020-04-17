import React, { Component } from "react";
import { SubHeaders, Zoom } from "./components.jsx";

export default class MiniMapContent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let { scale, minimap_scroll, createArticle } = this.props;
		return (
			<div id="zoom-wrapper" className="zoom-wrapper">
				<Zoom
					createArticle={createArticle}
					scale={scale}
					minimap_scroll={minimap_scroll}
				/>
				{/*<SubHeaders minimap_scroll={minimap_scroll} scale={scale} />*/}
				<SubHeaders minimap_scroll={minimap_scroll} scale={scale} />
			</div>
		);
	}
}
