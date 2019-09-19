import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import {Address_Pane, Payment_Pane, Cancel_Pane} from './/Components.jsx'


export default class Profile extends React.Component {

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.state = {
			selected: 'delivery',
		};
	}

	handleClick(e) {
		var field = e.target.id;
		this.setState({
			selected: e.target.id,
			[field]: 'selected'
		});
	}

	renderSwitch(param){
		switch(param) {
			case 'delivery':
				return <Address_Pane />;
			case 'payment':
				return <Payment_Pane />;
			case 'cancel':
				return <Cancel_Pane />;
			default: 
				return <Address_Pane />;
			}
		}

	render () {
		var delivery_style = '';
		var payment_style = '';
		var cancel_style = '';
		switch(this.state.selected) {
			case 'delivery':
				delivery_style = 'selected';
				break;
			case 'payment':
				payment_style = 'selected';
				break;
			case 'cancel':
				cancel_style = 'selected';
				break;
			default:
				delivery_style = 'selected';
				break;
		}

		return (
    	<div className="profile">
    		<Row>
    			<Col xs={3}>
    			<div className="profile-navbar">
    				<ul className="profile-options">
    					<li onClick={this.handleClick} className={delivery_style} id="delivery">Delivery Info</li>
    					<li onClick={this.handleClick} className={payment_style} id="payment">Payment Status</li>
    					<li onClick={this.handleClick} className={classnames('cancel_subscription', cancel_style)} id="cancel">Cancel Subscription</li>
    				</ul>
    			</div>
    			</Col>
    			<Col xs={9}>
    			<div>
    			{this.renderSwitch(this.state.selected)}
    			</div>
    			</Col>
    		</Row>
    	</div>
    	);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))

