import React, { Component } from "react";

export default class SubHeader extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.state = {};
	}

	handleClick() {
		let { subheader } = this.props;
		let offset = subheader.offsetTop;

		document.documentElement.scrollTop = document.body.scrollTop = offset;
	}

	render() {
		let { subheader, scale, minimap_scroll } = this.props;

		let offset = (subheader.offsetTop + subheader.offsetHeight) * scale;
		// let offset = subheader.yPos;
		// let offset = subheader.offsetTop * scale;

		let final_offset = -1 * minimap_scroll + offset + 41;
		let style = {
			top: final_offset + "px",
		};

		return (
			<div
				id="subheader"
				onClick={this.handleClick}
				className="subheader"
				style={style}
			>
				{subheader.innerText}
			</div>
		);
	}
}
