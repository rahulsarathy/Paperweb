import React, { useState } from 'react';
import ReactDOM from 'react-dom';
var classNames = require('classnames');
import $ from 'jquery';

class PaymentTab extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var classes = classNames({
			'payment-tab': true,
			'selected': this.props.selected
		});

		return (
			<div id={this.props.id} className={classes} onClick={this.props.handleClick}>
				{this.props.text}
			</div>
			);
	}
}

class Details extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			next_billed: ''
		}
	}

	componentDidMount() {
		this.getNextBilled();
	}

	getNextBilled() {
		$.ajax({
			url: '../api/payments/next_billing_date',
			type: 'GET',
			success: function(data) {
				var day = data.day;
				var month = data.month;
				var year = data.year;
				var date_string = month + ' ' + day + ', ' + year 
				this.setState({
					next_billed: date_string
				});
			}.bind(this)
		});
	}

	render() {
		return (
			<div>
			    <h3><span className="sub-success">You are subscribed to Pulp.</span> You will be next billed on {this.state.next_billed}</h3>
            	<button onClick={this.props.cancel}>Cancel my subscription</button>	
			</div>
			);
	}
}

class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			next_delivery: '',
		}
	}

	componentDidMount() {
		this.getNextDeliveryDate();
	}

	getNextDeliveryDate() {
		$.ajax({
			url: '../api/payments/next_delivery_date',
			type: 'GET',
			success: function(data) {
				var day = data.day;
				var month = data.month;
				var year = data.year;
				var date_string = month + ' ' + day + ', ' + year 
				this.setState({
					next_delivery: date_string
				});
			}.bind(this)
		});
	}

	render() {
		return (
			<div>
				<h3>Your next magazine will be delivered on {this.state.next_delivery}</h3>
			</div>
			);
	}
}

export default class Paid extends React.Component {

	constructor(props) {
		super(props);
		this.toggleSelected = this.toggleSelected.bind(this);
		this.state = {
			first: true,
			second: false,
			next_billed: ''
		};
	}

	toggleSelected(e) {
		if (e.target.id == 1) {
			this.setState({
				first: true,
				second: false,
			});
		}
		else {
			this.setState({
				first: false,
				second: true,
			});
		}
	}

	render () {
		var content;

		if (this.state.first) {
			content = <Details cancel={this.props.cancel}/>
		}
		else {
			content = <Schedule />
		}

        return (
            <div className="paid">
            	<div className="payment-tabs">
            		<PaymentTab id={1} selected={this.state.first} handleClick={this.toggleSelected} text={"Payment Details"} />
            		<PaymentTab id={2} selected={this.state.second} handleClick={this.toggleSelected} text={"Delivery Schedule"} />
            	</div>
            	{content}
            </div>
            );
    }
}