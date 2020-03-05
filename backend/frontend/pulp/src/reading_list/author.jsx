import React, { Component } from "react";

export default class Author extends Component {
	render() {
		return (
			<div className="author">
				{this.props.author ? (
					<p className="author_text">
						{"by " + this.props.author + " "}
					</p>
				) : (
					""
				)}
			</div>
		);
	}
}
