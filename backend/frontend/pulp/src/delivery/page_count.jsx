import React, { Component } from "react";

export default class PageCount extends Component {
	constructor(props) {
		super(props);
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
		return total;
	}

	render() {
		return (
			<div>
				<p>{this.calculateTotal()}/50 Pages</p>
			</div>
		);
	}
}
