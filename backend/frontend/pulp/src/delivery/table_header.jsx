import React, { Component } from "react";

export default class TableHeader extends Component {
	render() {
		return (
			<div className="table-header">
				<div
					onClick={() => this.props.changeSort("title")}
					className="title-header"
				>
					Title
				</div>
				<div
					onClick={() => this.props.changeSort("deliver")}
					className="subheader"
				>
					To Deliver?
				</div>
				<div
					onClick={() => this.props.changeSort("pages_compare")}
					className="page-header"
				>
					Number of Pages
				</div>
				<div
					onClick={() => this.props.changeSort("date_added")}
					className="date-header"
				>
					Date Added
				</div>
			</div>
		);
	}
}
