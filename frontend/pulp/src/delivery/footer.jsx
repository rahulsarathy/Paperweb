import React, { Component } from "react";
import { PageCount } from "./components.jsx";
import $ from "jquery";

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			next_date: {}
		};
	}

	componentDidMount() {
		this.getMagazineDate();
	}

	getMagazineDate() {
		$.ajax({
			url: "../api/payments/next_delivery_date",
			type: "GET",
			success: function(data) {
				console.log(data);
				this.setState({
					next_date: data
				});
			}.bind(this)
		});
	}

	render() {
		return (
			<div className="footer">
				<p>
					Your next magazine will arrive on
					{" " +
						this.state.next_date.month +
						" " +
						this.state.next_date.day +
						" " +
						this.state.next_date.year}
				</p>
				<PageCount
					overflow={this.props.overflow}
					total={this.props.page_total}
				/>
			</div>
		);
	}
}
