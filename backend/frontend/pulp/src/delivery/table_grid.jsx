import React, { Component } from "react";
import {} from "./components.jsx";

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

		return filtered.map(rlist_item => (
			<tr key={rlist_item.article.permalink}>
				<td>
					<p className="title">{rlist_item.article.title}</p>
					<p className="domain">
						{getLocation(rlist_item.article.permalink)}
					</p>
				</td>
				<td className="to-deliver">
					<input
						type="checkbox"
						onChange={() => this.props.changeDeliver(rlist_item)}
						checked={rlist_item.to_deliver}
					/>
				</td>
				<td className="">{rlist_item.article.page_count}</td>
				<td className="rightmost">
					{new Date(rlist_item.date_added)
						.toDateString()
						.split(" ")
						.slice(1)
						.join(" ")}
				</td>
			</tr>
		));
	}

	createTable1() {
		return this.props.reading_list.map(rlist_item => (
			<div key={rlist_item.article.permalink} className="new-table">
				<div className="title">
					<p className="">{rlist_item.article.title}</p>
					<p className="">
						{getLocation(rlist_item.article.permalink)}
					</p>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={() => this.props.changeDeliver(rlist_item)}
						checked={rlist_item.to_deliver}
					/>
				</div>
				<div>{rlist_item.article.page_count}</div>
				<div>
					{new Date(rlist_item.date_added)
						.toDateString()
						.split(" ")
						.slice(1)
						.join(" ")}
				</div>
			</div>
		));
	}

	render() {
		return (
			<div className="table-container">
				<div className="table-header">
					<div className="title-header">Title</div>
					<div className="subheader">To Deliver?</div>
					<div className="subheader">Number of Pages</div>
					<div className="subheader">Date Added</div>
				</div>
				<div className="delivery-items">
					{this.props.reading_list.map(rlist_item => (
						<div
							className="delivery-item"
							key={rlist_item.article.permalink}
						>
							<div className="article-title">
								{rlist_item.article.title}
							</div>
							<div className="to-deliver">
								<input
									type="checkbox"
									onChange={() =>
										this.props.changeDeliver(rlist_item)
									}
									checked={rlist_item.to_deliver}
								/>{" "}
							</div>
							<div className="page-count">
								{rlist_item.article.page_count}
							</div>
							<div className="date-added">
								{rlist_item.date_added}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}
