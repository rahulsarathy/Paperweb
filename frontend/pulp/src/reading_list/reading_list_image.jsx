import React, { Component } from "react";

export default class ReadingListImage extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="reading-list-image">
				{this.props.src !== null ? (
					<img className="first-image" src={this.props.src} />
				) : (
					<div></div>
				)}
			</div>
		);
	}
}
