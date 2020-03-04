import React, { Component } from "react";
import { TableHeader, DeliveryItems } from "./components.jsx";
var Infinite = require("react-infinite");

export default class TableContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="table-container">
				<TableHeader
					changeSort={this.props.changeSort}
					sort={this.props.sort}
				/>
				<DeliveryItems
					reading_list={this.props.reading_list}
					search={this.props.search}
					sort={this.props.sort}
					changeDeliver={this.props.changeDeliver}
				/>
			</div>
		);
	}
}
