import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';

export default class Paid extends React.Component {

	constructor(props) {
		super(props);
		this.cancelPayment = this.cancelPayment.bind(this);
		this.state = {
		};
	} 

	cancelPayment() {
		$.ajax({
			url: '../api/payments/cancel_payment',
			type: 'GET',
			success: function(data, statusText, xhr) {
				this.setState({
					paid: false
				});
			}
		});
	}


	render () {
        return (
            <div>
            	<button>Payment Details</button>
            	<button>Delivery Schedule</button>
            	<h1>User has paid</h1>
            	<button onClick={this.cancelPayment}>Cancel Subscription</button>
            </div>
            );
    }
}