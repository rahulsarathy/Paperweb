import React, { Component } from "react";
import { SubHeaders } from "./components.jsx";

let highlighted_tags = ["b", "h1", "h2", "h3", "h4", "h5", "h6"];

export default class MiniMapContent extends Component {
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

	render() {
		let { subheaders } = this.state;
		let { scale, minimap_scroll, createArticle } = this.props;
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
