import React, { Component } from "react";
import ReactDOM from "react-dom";
import { LandingHeader } from "./components.jsx";
import "./article_landing.scss";

import axios from "axios";

export class Example extends Component {
	render() {
		return (
			<div className="example">
				<div className="example-image"></div>
				<div className="example-subtitle"></div>
			</div>
		);
	}
}

export default class ArticleLanding extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.read = this.read.bind(this);

		this.state = {
			value: "",
		};
	}

	handleChange(e) {
		this.setState({
			value: e.target.value,
		});
	}

	read() {
		axios
			.get(`/articles/api/get_article_id/`, {
				params: {
					url: this.state.value,
				},
			})
			.then((res) => {
				let data = res.data;
				let url = "/articles/" + data;
				window.location.replace(url);
			});
	}

	render() {
		return (
			<div className="article-landing">
				<LandingHeader />
				<div className="content">
					<div className="introduction">
						<h1>A better way to read online.</h1>
						<p>
							Reading long articles online can be a pain. Pulp is
							a better way to view lengthy articles.
						</p>
					</div>
					<div className="article-url">
						<input
							onChange={this.handleChange}
							placeholder={"Input an article URL"}
						/>
						{this.state.value.length !== 0 ? (
							<button onClick={this.read} className="read-button">
								Read
							</button>
						) : (
							<div></div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<ArticleLanding />, document.getElementById("article_landing"));
