import React, { Component } from "react";

function bold_compare(a, b) {
	if (a.offsetTop > b.offsetTop) return 1;
	if (b.offsetTop > a.offsetTop) return -1;
	return 0;
}

export default class SubHeaders extends Component {
	render() {
		let { subheaders, minimap_scroll } = this.props;
		return (
			<div
				className="subheaders"
				style={{
					top: "-" + minimap_scroll + "px",
				}}
			>
				{subheaders.sort(bold_compare).map((element, index) => (
					<div key={index}>{element.innerText}</div>
				))}
			</div>
		);
	}
}
