import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import $ from 'jquery';

const stripe = Stripe(stripe_public_key);

export default class Payment_Pane extends React.Component {

	constructor(props) {
		super(props);
		// this.setStripeScript();
		this.createSession = this.createSession.bind(this);
		this.state = {
			paid: false
		};
	}

	componentDidMount() {
		this.checkPaymentStatus();
	}

	checkPaymentStatus(){
		$.ajax({
			url: '../api/payments/payment_status',
			type: 'GET',
			success: function(data, statusText, xhr) {
				console.log(xhr)
				if (xhr.status == 208) {
					this.setState({
						paid: true
					});
				}
			}.bind(this)
		});
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



	startPayment(id) {
		console.log("starting stripe payment")
		stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: id
    }).then(function (result) {
    	// If `redirectToCheckout` fails due to a browser or network
    	// error, display the localized error message to your customer
    	// using `result.error.message`.
    	console.log(result.error.message)
    });
}

	render () {
		return (
			<div >
				<h3>Magazines are $15.00/Month.</h3>
				<button onClick={this.createSession}>Get Pulp</button>
			</div>
    	);
  }
}