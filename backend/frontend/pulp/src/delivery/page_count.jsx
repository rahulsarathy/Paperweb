import React, { Component } from "react";

export default class PageCount extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<p>{this.props.total}/50 Pages</p>
				{this.props.overflow ? <div>OVERFLOW!</div> : <div></div>}
			</div>
		);
	}
}
