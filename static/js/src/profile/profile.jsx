import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import {Address_Pane, Payment_Pane, Cancel_Pane, Unpaid, Paid} from './Components.jsx'


export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.cancelPayment = this.cancelPayment.bind(this);

		this.state = {
			paid: true
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
				else {
					this.setState({
						paid: false
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
			}.bind(this)
		});
	}


	render () {

		return (
    	<div className="profile">
    		{this.state.paid ? <Paid cancel={this.cancelPayment}/> : <Unpaid />}
    	</div>
    	);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))

