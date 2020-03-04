import React, { Component } from "react";
import {
	getLocation,
	pages_compare,
	deliver_compare,
	date_compare,
	title_compare
} from "./sorts.js";
import { DeliveryRow } from "./components.jsx";

export default class DeliveryItems extends Component {
	chooseSort() {
		switch (this.props.sort) {
			case "title":
				return this.props.reading_list.sort(title_compare);
			case "deliver":
				return this.props.reading_list.sort(deliver_compare);
			case "pages_compare":
				return this.props.reading_list.sort(pages_compare);
			case "date_added":
				return this.props.reading_list.sort(date_compare);
			default:
				return this.props.reading_list.sort(title_compare);
		}
	}

	createFiltered() {
		let search = this.props.search;
		let reading_list = this.props.reading_list;
		let sorted = this.chooseSort();
		let filtered = [];
		for (let i = 0; i < sorted.length; i++) {
			if (
				search === undefined ||
				sorted[i].article.title
					.toLowerCase()
					.includes(search.toLowerCase())
			) {
				filtered.push(sorted[i]);
			}
		}
		return filtered;
	}

	createTable() {
		let filtered = this.createFiltered();

		return filtered.map(reading_list_item => (
			<DeliveryRow
				key={reading_list_item.article.permalink}
				title={reading_list_item.article.title}
				page_count={reading_list_item.article.page_count}
				date_added={reading_list_item.date_added}
				checked={reading_list_item.to_deliver}
				permalink={reading_list_item.article.permalink}
				changeDeliver={this.props.changeDeliver}
			/>
		));
	}
	render() {
		return (
			<div className="delivery-items">
				<Infinite containerHeight={500} elementHeight={50}>
					{this.createTable()}
				</Infinite>
			</div>
		);
	}
}
