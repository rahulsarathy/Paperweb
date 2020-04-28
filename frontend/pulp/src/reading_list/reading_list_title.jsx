import React, { Component } from "react";

export default class ReadingListTitle extends Component {
	render() {
		// let href =
		// 	"../articles/?url=" + encodeURIComponent(this.props.permalink);
		let href = "../articles/" + this.props.article_id;

		return (
			<div>
				<h3>
					<a target="_blank" href={href}>
						{this.props.title}
					</a>
				</h3>
			</div>
		);
	}
}
