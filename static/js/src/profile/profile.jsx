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

		this.state = {
			paid: false
		};
	}

	componentDidMount() {

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

	render () {

		return (
    	<div className="profile">
    		{this.state.paid ? <Paid /> : <Unpaid />}
    	</div>
    	);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))

