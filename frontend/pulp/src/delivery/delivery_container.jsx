import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";
import { TableContainer, PageCount, Filter, Footer } from "./components.jsx";
import $ from "jquery";

export default class DeliveryContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handleSearch = this.handleSearch.bind(this);
		this.changeSort = this.changeSort.bind(this);
		this.changeDeliver = this.changeDeliver.bind(this);

		this.state = {
			sort: "date_added",
			overflow: false,
			total: 0
		};
	}

	changeSort(sort) {
		this.setState({ sort: sort });
	}

	handleSearch(e) {
		this.setState({ search: e.target.value });
	}

	changeDeliver(permalink, will_overflow, checked) {
		if (will_overflow) {
			this.setState({
				overflow: true
			});
		} else {
			this.setState({
				overflow: false
			});
			this.props.changeDeliver(checked, permalink);
		}
	}

	render() {
		if (this.props.empty) {
			return <div></div>;
		}
		return (
			<div className="delivery-container">
				<Filter handleSearch={this.handleSearch} />
				<Counter items={this.props.reading_list.length} />
				<TableContainer
					search={this.state.search}
					reading_list={this.props.reading_list}
					sort={this.state.sort}
					changeDeliver={this.changeDeliver}
					changeSort={this.changeSort}
					page_total={this.props.page_total}
				/>
				<Footer
					overflow={this.state.overflow}
					page_total={this.props.page_total}
				/>
			</div>
		);
	}
}

export class Counter extends React.Component {
	render() {
		return (
			<div className="counter">
				{this.props.items} articles in your print list
			</div>
		);
	}
}
