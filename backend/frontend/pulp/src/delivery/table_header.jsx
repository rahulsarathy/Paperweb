import React, { Component } from "react";

export default class TableHeader extends Component {
	render() {
		return (
			<div className="table-header">
				<div className="title-header">Title</div>
				<div className="subheader">To Deliver?</div>
				<div className="page-header">Number of Pages</div>
				<div className="date-header">Date Added</div>
			</div>
		);
	}
}
