import React, { Component } from "react";
import $ from "jquery";
import {
	getLocation,
	pages_compare,
	deliver_compare,
	date_compare,
	title_compare
} from "./sorts.js";
import { DeliveryItem } from "./components.jsx";

export default class DeliveryItems extends Component {
	constructor(props) {
		super(props);
	}

	chooseSort() {
		let reading_list = this.props.reading_list;

		switch (this.props.sort) {
			case "title":
				return reading_list.sort(title_compare);
			case "deliver":
				return reading_list.sort(deliver_compare);
			case "pages_compare":
				return reading_list.sort(pages_compare);
			case "date_added":
				return reading_list.sort(date_compare);
			default:
				return reading_list.sort(title_compare);
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

	render() {
		let filtered = this.createFiltered();
		return (
			<div className="delivery-items">
				{filtered.map(item => (
					<DeliveryItem
						key={item.article.permalink}
						title={item.article.title}
						page_count={item.article.page_count}
						date_added={item.date_added}
						checked={item.to_deliver}
						permalink={item.article.permalink}
						changeDeliver={this.props.changeDeliver}
						page_total={this.props.page_total}
					/>
				))}
			</div>
		);
	}
}
