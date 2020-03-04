import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";
import { TableContainer, PageCount, Filter } from "./components.jsx";

export default class DeliveryContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handleSearch = this.handleSearch.bind(this);
		this.changeSort = this.changeSort.bind(this);

		this.state = {
			sort: "date_added"
		};
	}

	changeSort(sort) {
		this.setState({ sort: sort });
	}

	handleSearch(e) {
		this.setState({ search: e.target.value });
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
					reading_list={this.props.reading_list}
					sort={this.state.sort}
					changeDeliver={this.props.changeDeliver}
					changeSort={this.changeSort}
				/>
			</div>
		);
	}
}
