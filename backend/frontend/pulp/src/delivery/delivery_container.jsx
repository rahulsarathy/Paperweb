import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";
import { TableContainer, PageCount, Filter } from "./components.jsx";
import $ from "jquery";

export default class DeliveryContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handleSearch = this.handleSearch.bind(this);
		this.changeSort = this.changeSort.bind(this);
		this.changeDeliver = this.changeDeliver.bind(this);

		this.state = {
			sort: "date_added",
			reading_list: []
		};
	}

	changeSort(sort) {
		this.setState({ sort: sort });
	}

	handleSearch(e) {
		this.setState({ search: e.target.value });
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
		if (this.props.empty) {
			return <div></div>;
		}
		return (
			<div>
				<Filter handleSearch={this.handleSearch} />
				<PageCount reading_list={this.props.reading_list} />
				<TableContainer
					search={this.state.search}
					reading_list={this.state.reading_list}
					sort={this.state.sort}
					changeDeliver={this.changeDeliver}
					changeSort={this.changeSort}
				/>
			</div>
		);
	}
}
