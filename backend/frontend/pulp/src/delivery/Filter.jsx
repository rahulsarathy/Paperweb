import React, { Component } from "react";

export default class Filter extends Component {
	render() {
		return (
			<div className="filter">
				<input
					placeholder="Search"
					type="text"
					onChange={this.props.handleSearch}
				/>
			</div>
		);
	}
}
