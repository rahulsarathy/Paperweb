import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";
import { TableContainer } from "./components.jsx";

export default class DeliveryContainer extends React.Component {
	constructor(props) {
		super(props);

		this.handleSearch = this.handleSearch.bind(this);
		this.calculateTotal = this.calculateTotal.bind(this);
		this.changeSort = this.changeSort.bind(this);

		this.state = {
			sort: "date_added",
			total: 0
		};
	}

	componentDidMount() {
		this.calculateTotal();
	}

	changeSort(sort) {
		this.setState({ sort: sort });
	}

	calculateTotal() {
		let reading_list = this.props.reading_list;
		let total = 0;
		let total_articles = 0;
		for (let i = 0; i < reading_list.length; i++) {
			if (reading_list[i].to_deliver) {
				total += reading_list[i].article.page_count;
				total_articles += 1;
			}
		}
		this.setState({
			total: total,
			total_articles: total_articles
		});
	}

	handleSearch(e) {
		this.setState({ search: e.target.value });
	}

	changeSortLabel() {
		switch (this.state.sort) {
			case "title":
				return "Title";
			case "deliver":
				return "To Deliver?";
			case "pages_compare":
				return "Number of Pages";
			case "date_added":
				return "Date Added";
			default:
				return "Title";
		}
	}

	render() {
		if (this.props.empty) {
			return <div></div>;
		}
		return (
			<div>
				<div className="filter">
					<input
						placeholder="Search"
						type="text"
						onChange={this.handleSearch}
					/>
				</div>
				<label className="sort-label">Sort By</label>
				<p>{this.state.total}/50 Pages</p>
				<DropdownButton
					className="sort-button"
					title={this.changeSortLabel()}
				>
					<Dropdown.Item onClick={() => this.changeSort("title")}>
						Title
					</Dropdown.Item>
					<Dropdown.Item onClick={() => this.changeSort("deliver")}>
						To Deliver?
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => this.changeSort("pages_compare")}
					>
						Number of Pages
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => this.changeSort("date_added")}
					>
						Date Added
					</Dropdown.Item>
				</DropdownButton>
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
