import React, { Component } from "react";

export default class PageCount extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="pagecount">
				<p>{this.props.total}/50 pages used</p>
			</div>
		);
	}
}


