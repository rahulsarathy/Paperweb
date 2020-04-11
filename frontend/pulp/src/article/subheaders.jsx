import React, { Component } from "react";
import { SubHeader } from "./components.jsx";

function bold_compare(a, b) {
	if (a.offsetTop > b.offsetTop) return 1;
	if (b.offsetTop > a.offsetTop) return -1;
	return 0;
}

let highlighted_tags = ["b", "h1", "h2", "h3", "h4", "h5", "h6"];

export default class SubHeaders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subheaders: [],
		};
	}

	componentDidMount() {
		let minimap = document.getElementById("minimap");

		let subheaders = [];

		highlighted_tags.forEach((tag) => {
			let tags = minimap.getElementsByTagName(tag);
			subheaders.push(...tags);
		});

		console.log(subheaders);
		this.setState({
			subheaders: subheaders,
		});
	}

	rendersubheader(subheader, index) {
		let { minimap_scroll } = this.props;

		let offset = subheader.offsetTop + minimap_scroll;
		let style = {
			top: "-" + offset + "px",
		};
		return (
			<div key={index} style={style}>
				subheader.innerText
			</div>
		);
	}

	rendersubheaders() {}

	render() {
		let { subheaders } = this.state;

		let { minimap_scroll, scale } = this.props;
		return (
			<div className="subheaders">
				{subheaders.sort(bold_compare).map((subheader, index) => (
					<SubHeader
						scale={scale}
						subheader={subheader}
						key={index}
						minimap_scroll={minimap_scroll}
					/>
				))}
			</div>
		);
	}
}
