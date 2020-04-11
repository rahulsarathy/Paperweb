import React, { Component } from "react";

export default class SubHeader extends Component {
	render() {
		let { subheader, scale, minimap_scroll } = this.props;

		// let offset = (subheader.offsetTop - subheader.offsetHeight) * scale;

		let offset = subheader.offsetTop * scale;

		let final_offset = -1 * minimap_scroll + offset;
		let style = {
			top: final_offset + "px",
			lineHeight: 1,
			position: "fixed",
			right: "75px",
			textAlign: "right",
			width: "200px",
		};

		return <div style={style}>{subheader.innerText}</div>;
	}
}
