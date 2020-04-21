import React, { Component } from "react";

let highlighted_tags = ["b", "strong", "h1", "h2", "h3", "h4", "h5", "h6"];

function bold_compare(a, b) {
	if (a.offsetTop > b.offsetTop) return 1;
	if (b.offsetTop > a.offsetTop) return -1;
	return 0;
}

export default class TableOfContents extends Component {
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

	spaceSubHeaders(subheaders) {
		let height = this.props.height;
		for (let i = 1; i < subheaders.length; i++) {
			subheaders[i] - height;
		}
	}

	render() {
		let { subheaders } = this.state;

		return (
			<div className="table-of-contents">
				{subheaders.sort(bold_compare).map((subheader, index) => (
					<div key={index}>{subheader.innerText}</div>
				))}
			</div>
		);
	}
}
