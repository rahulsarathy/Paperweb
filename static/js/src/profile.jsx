import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';

import {Category, Address} from './components/Components.jsx'


export default class Profile extends React.Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this)
		
		this.state = {
			data: {},
			value: ''
		};
	}

	handleChange(e) {
		this.setState(
			{
				value: e.target.value
			});
	}
   
	render () {
		return (
    	<div className="profile">
    		<ul>
    			<li>Delivery Address</li>
    			<li>Payment Info</li>
    			<li>Delivery Schedule</li>
    			<li>Cancel Subscription</li>
    		</ul>
    		<p>Magazines will be delivered to 1574 Elka Avenue, San Jose CA 95129</p>
    		<h3>Change Address</h3>
    		<input value={this.state.value} onChange={this.handleChange}></input>
    		<Address />
    	</div>
    	);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))

