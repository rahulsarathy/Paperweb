import React, { Component } from "react";
import { TableHeader, DeliveryItems } from "./components.jsx";
import $ from "jquery";

export default class TableContainer extends Component {
	constructor(props) {
		super(props);

		this.changeDeliver = this.changeDeliver.bind(this);
		this.getReadingList = this.getReadingList.bind(this);

		this.state = {
			reading_list: []
		};
	}

	componentDidMount() {
		this.getReadingList();
	}

	getReadingList() {
		var csrftoken = $("[name=csrfmiddlewaretoken]").val();
		let data = {
			csrfmiddlewaretoken: csrftoken
		};
		$.ajax({
			url: "../api/reading_list/get_reading",
			data: data,
			type: "GET",
			success: function(data) {
				this.setState({
					reading_list: data
				});
				console.log(data[0].to_deliver);
			}.bind(this)
		});
	}

	changeDeliver(to_deliver, permalink) {
		var csrftoken = $("[name=csrfmiddlewaretoken]").val();
		let data = {
			to_deliver: !to_deliver,
			permalink: permalink,
			csrfmiddlewaretoken: csrftoken
		};
		$.ajax({
			url: "../api/reading_list/update_deliver",
			data: data,
			type: "POST",
			success: function(data) {
				this.setState({
					reading_list: data
				});
				console.log(data[0].to_deliver);
			}.bind(this)
		});
	}

	render() {
		return (
			<div className="table-container">
				<TableHeader
					changeSort={this.props.changeSort}
					sort={this.props.sort}
				/>
				<DeliveryItems
					reading_list={this.state.reading_list}
					search={this.props.search}
					sort={this.props.sort}
					changeDeliver={this.changeDeliver}
				/>
			</div>
		);
	}
}
