import React, { Component } from "react";
import $ from "jquery";

let summaries = {};

export default class Summary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			summary: "",
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.a_tag.href !== this.props.a_tag.href) {
			this.getSummary(this.props.a_tag.href);
		}
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
		});
	}

	render() {
		let { a_tag, show_summary } = this.props;

		// if (!show_summary) {
		// 	console.log("hide");
		// 	return <div></div>;
		// }

		if (a_tag.offsetTop === undefined) {
			console.log("empty");
			return <div></div>;
		}
		let adjusted_pos = parseInt(a_tag.offsetTop) - 300.0 / 2.0;
		let position = {
			top: a_tag.offsetTop,
			left: a_tag.offsetLeft,
		};

		if (this.state.loading) {
			console.log("loading");

			return (
				<div style={position} className="summary">
					<h3>Loading Summary</h3>
				</div>
			);
		}
		console.log("show");

		return (
			<div style={position} className="summary">
				<h3>{this.state.title}</h3>
				{this.state.summary}
			</div>
		);
	}
}
