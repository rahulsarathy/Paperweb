import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';

import {Category, Address_Pane} from './components/Components.jsx'


export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			selected: 'address'
		};
	}

	handleClick(e) {
		
	}
   
	render () {
		return (
    	<div className="profile">
    		<div className="row">
    			<div className="col-3 profile-navbar">
    				<ul className="profile-options">
    					<li onClick={this.handleClick} id="payment">Payment Info</li>
    					<li onClick={this.handleClick} id="schedule">Delivery Schedule</li>
    					<li onClick={this.handleClick} className="cancel_subscription" id="cancel">Cancel Subscription</li>
    				</ul>
    			</div>
    			<div className="col-9">
    				<Address_Pane />
    			</div>
    		</div>
    	</div>
    	);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))

