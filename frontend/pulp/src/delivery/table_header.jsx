import React, { Component } from "react";

export default class TableHeader extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="table-header">
				<TitleHeader
					sort={this.props.sort}
					changeSort={this.props.changeSort}
				/>
				<DeliverHeader
					sort={this.props.sort}
					changeSort={this.props.changeSort}
				/>
				<PageHeader
					sort={this.props.sort}
					changeSort={this.props.changeSort}
				/>
				<DateHeader
					sort={this.props.sort}
					changeSort={this.props.changeSort}
				/>
			</div>
		);
	}
}

function highlight(sort, type) {
	if (sort === type) {
		return "selected";
	} else {
		return "unselected";
	}
}

class DateHeader extends Component {
	render() {
		let className = highlight(this.props.sort, "date_added");

		return (
			<div
				onClick={() => this.props.changeSort("date_added")}
				className={"date-header" + " " + className}
			>
				Date Added
			</div>
		);
	}
}

class PageHeader extends Component {
	render() {
		let className = highlight(this.props.sort, "pages_compare");
		return (
			<div
				onClick={() => this.props.changeSort("pages_compare")}
				className={"page-header" + " " + className}
			>
				Number of Pages
			</div>
		);
	}
}

class DeliverHeader extends Component {
	render() {
		let className = highlight(this.props.sort, "deliver");

		return (
			<div
				onClick={() => this.props.changeSort("deliver")}
				className={"subheader" + " " + className}
			>
				To Deliver?
			</div>
		);
	}
}

class TitleHeader extends Component {
	render() {
		let className = highlight(this.props.sort, "title");

		return (
			<div
				onClick={() => this.props.changeSort("title")}
				className={"title-header" + " " + className}
			>
				Article Title
			</div>
		);
	}
}
