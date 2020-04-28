import React, { Component } from "react";
import $ from "jquery";

let summaries = {};

export default class Summary extends Component {
	constructor(props) {
		super(props);

		this.handleHover = this.handleHover.bind(this);
		this.handleLeave = this.handleLeave.bind(this);
		this.closeSummary = this.closeSummary.bind(this);
		this.showSummary = this.showSummary.bind(this);

		this.state = {
			loading: false,
			summary: "",
			show_summary: false,
			hovered: false,
		};
	}

	componentDidUpdate(prevProps, prevState) {
		this.findLinks();

		if (this.state.a_tag === undefined) {
			return;
		}
		if (prevState.a_tag === undefined) {
			this.getSummary(this.state.a_tag.href);
			return;
		}
		if (prevState.a_tag.href !== this.state.a_tag.href) {
			this.getSummary(this.state.a_tag.href);
			return;
		}
	}

	componentDidMount() {
		// this.getSummary();
	}

	// componentDidMount() {
	// 	console.log("component mounted");
	// 	if (this.props.a_tag !== undefined) {
	// 		let url = this.props.a_tag.href;

	// 		this.getSummary(url);
	// 	}
	// }

	handleHover(evt, a_tag) {
		if (this.state.show_summary) {
			return;
		}
		this.setState({
			a_tag: a_tag,
			pageX: evt.pageX,
			pageY: evt.pageY,
			hovered: true,
			show_summary: false,
		});
	}

	handleLeave(e) {
		this.setState({
			hovered: false,
			loading: false,
			summary: "",
			show_summary: false,
		});
	}

	closeSummary() {
		this.setState({
			show_summary: false,
			loading: false,
		});
	}

	getOffsetTop(element) {
		let offsetTop = 0;
		while (element) {
			offsetTop += element.offsetTop;
			element = element.offsetParent;
		}
		return offsetTop;
	}

	findLinks() {
		let a_tags = document
			.getElementById("article-wrapper")
			.getElementsByTagName("a");
		for (let i = 0; i < a_tags.length; i++) {
			// a_tags[i].onmouseover = this.handleHover;

			a_tags[i].onmouseenter = function(evt) {
				this.handleHover(evt, a_tags[i]);
			}.bind(this);

			// a_tags[i].onmouseleave = this.handleLeave;
			a_tags[i].id = "link" + i;
		}
	}

	showSummary(e) {
		this.setState({
			show_summary: true,
		});
	}

	getSummary(url) {
		// let cache = summaries[url];
		// if (cache !== undefined) {
		// 	console.log("using cache");
		// 	this.setState({});
		// }
		let data = {
			url: url,
		};
		this.setState({
			loading: true,
		});
		$.ajax({
			type: "GET",
			url: "../api/reading_list/get_summary",
			data: data,
			success: function(data) {
				summaries[url] = data;
				this.setState({
					summary: data.summary,
					title: data.title,
					loading: false,
				});
			}.bind(this),
			error: function(xhr) {
				this.setState({
					loading: false,
				});
			}.bind(this),
		});
	}

	render() {
		let { a_tag, show_summary, hovered, pageX } = this.state;

		if (!hovered) {
			return <div></div>;
		}

		let line_height = 20;
		let style;
		// if is over line height
		if (a_tag.offsetHeight > line_height) {
			style = {
				top: this.getOffsetTop(a_tag) - 30,
				left: a_tag.offsetLeft,
			};
		} else {
			// style = {
			// 	width: width,
			// 	top: a_tag.offsetTop - a_tag.offsetHeight - 10,
			// 	left: a_tag.offsetLeft + a_tag.offsetWidth / 2 - 30,
			// };

			style = {
				top: this.getOffsetTop(a_tag) - a_tag.offsetHeight - 10,
				left: pageX - 30,
			};
		}

		if (!show_summary) {
			return (
				<div
					onClick={this.showSummary}
					style={style}
					className="summary-hover"
					onMouseLeave={this.handleLeave}
				>
					<div className="hover-box"></div>
					Preview
					<div className="arrow-down"></div>
				</div>
			);
		}

		// if (a_tag.offsetTop === undefined) {
		// 	console.log("empty");
		// 	return <div></div>;
		// }
		let adjusted_pos = parseInt(a_tag.offsetTop) - 300.0 / 2.0;
		// let position = {
		// 	top: a_tag.offsetTop,
		// 	left: a_tag.offsetLeft,
		// };

		style["top"] = style["top"] - 300.0 / 2.0;
		style["left"] = style["left"] - 125;

		if (this.state.loading) {
			return (
				<div style={style} className="summary">
					<h3>Loading {}</h3>
				</div>
			);
		}

		return (
			<div style={style} className="summary">
				<button className="close-summary" onClick={this.closeSummary}>
					X
				</button>
				<h3>{this.state.title}</h3>
				{this.state.summary}
			</div>
		);
	}
}
