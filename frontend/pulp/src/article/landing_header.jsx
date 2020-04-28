import React, { Component } from "react";
import "./article_landing.scss";

export default class LandingHeader extends Component {
	render() {
		return (
			<div className="article-header">
				<div className="inner-article-header">
					<img src="../../static/images/pulp_black_logo.svg"></img>
				</div>
			</div>
		);
	}
}
