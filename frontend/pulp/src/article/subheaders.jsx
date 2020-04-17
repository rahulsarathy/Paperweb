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

			for (let i = 0; i < tags.length; i++) {
				if (tags[i].offsetLeft === 0) {
					subheaders.push(tags[i]);
				}
			}
		});

		this.setState({
			subheaders: subheaders,
		});
	}

	rendersubheader(subheader, index) {
		let { minimap_scroll } = this.props;

		let offset = subheader.offsetTop + minimap_scroll + 41;
		let style = {
			top: "-" + offset + "px",
		};
		return (
			<div key={index} style={style}>
				subheader.innerText
			</div>
		);
	}

	spacesubheaders(subheaders) {
		let { scale } = this.props;
		let new_subheaders = subheaders;

		for (let i = 0; i < new_subheaders.length; i++) {
			new_subheaders[i].yPos =
				(new_subheaders[i].offsetTop + new_subheaders[i].offsetHeight) *
				scale;
			new_subheaders[i].scaled_height =
				new_subheaders[i].offsetHeight * scale;
		}

		console.log(new_subheaders);

		for (let i = 1; i < new_subheaders.length; i++) {
			if (20 + new_subheaders[i - 1].yPos > new_subheaders[i].yPos) {
				let overshot =
					new_subheaders[i - 1].scaled_height +
					new_subheaders[i - 1].yPos;
				let amount_overshot = overshot - new_subheaders[i].yPos;
				let padding = 50;
				new_subheaders[i].yPos =
					amount_overshot + new_subheaders[i].yPos + padding;
			}
		}
		return new_subheaders;
	}

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
