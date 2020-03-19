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

	componentDidUpdate(prevProps, prevState) {
		let new_total = this.calculateTotal(this.props.reading_list);
		let prev_total = this.calculateTotal(prevProps.reading_list);
		if (new_total !== prev_total) {
			this.setState({
				total: new_total
			});
		}
	}

	changeSort(sort) {
		this.setState({ sort: sort });
	}

	handleSearch(e) {
		this.setState({ search: e.target.value });
	}

	calculateTotal(reading_list) {
		let total = 0;
		let total_articles = 0;
		for (let i = 0; i < reading_list.length; i++) {
			if (reading_list[i].to_deliver) {
				total += reading_list[i].article.page_count;
				total_articles += 1;
			}
		}
		return total;
	}

	changeDeliver(checked, permalink, page_count) {
		if (!checked) {
			let total = this.calculateTotal(this.props.reading_list);
			if (total + page_count > 50) {
				this.setState({
					overflow: true
				});
			} else {
				this.setState({
					overflow: false
				});
				this.props.changeDeliver(checked, permalink);
			}
		} else {
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
				<TableContainer
					search={this.state.search}
					reading_list={this.props.reading_list}
					sort={this.state.sort}
					changeDeliver={this.changeDeliver}
					changeSort={this.changeSort}
				/>
				<Footer
					overflow={this.state.overflow}
					total={this.state.total}
				/>
			</div>
		);
	}
}
