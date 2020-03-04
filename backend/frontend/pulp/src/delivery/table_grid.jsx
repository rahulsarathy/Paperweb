import React, { Component } from "react";
import { DeliveryRow } from "./components.jsx";

function getLocation(href) {
	var l = document.createElement("a");
	l.href = href;
	return l.hostname;
}

function pages_compare(a, b) {
	if (a.article.page_count > b.article.page_count) return -1;
	if (b.article.page_count > a.article.page_count) return 1;
	return 0;
}

function deliver_compare(a, b) {
	if (a.to_deliver) {
		// If both are set to_deliver, compare by date
		if (b.to_deliver) {
			return date_compare(a, b);
		}
		return -1;
	}
	if (b.to_deliver) {
		return 1;
	}
	return 0;
}

function date_compare(a, b) {
	let date_a = new Date(a.date_added);
	let date_b = new Date(b.date_added);
	if (date_a > date_b) return -1;
	if (date_b > date_a) return 1;
	return 0;
}

function title_compare(a, b) {
	if (a.article.title > b.article.title) return 1;
	if (b.article.title > a.article.title) return -1;
	return 0;
}

export default class TableGrid extends Component {
	constructor(props) {
		super(props);
	}

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

	createTable() {
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
			<div className="table-container">
				<div className="table-header">
					<div className="title-header">Title</div>
					<div className="subheader">To Deliver?</div>
					<div className="page-header">Number of Pages</div>
					<div className="date-header">Date Added</div>
				</div>
				<div className="delivery-items">{this.createTable()}</div>
			</div>
		);
	}
}
