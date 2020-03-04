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

		this.changeDeliver = this.changeDeliver.bind(this);
		this.getReadingList = this.getReadingList.bind(this);

		this.state = {
			reading_list: []
		};
	}

	chooseSort() {
		let reading_list = this.state.reading_list;

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

	createFiltered() {
		let search = this.props.search;
		let reading_list = this.state.reading_list;
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
						changeDeliver={this.changeDeliver}
					/>
				))}
			</div>
		);
	}
}
