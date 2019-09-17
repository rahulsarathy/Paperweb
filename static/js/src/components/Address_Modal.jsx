import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';
import $ from 'jquery';

export default class Address_Model extends React.Component {

	constructor(props) {
		super(props);

		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);

		this.state = {
			show: false,
		};
	}

	showModal() {
		this.setState({
			show: true
		});
	}

	closeModal() {
		this.setState({
			show: false
		});
	}

	render () {
		return (
			<div >
				<button onClick={this.showModal}>Change Address</button>
				<Modal show={this.state.show}>
					Address Line 1
					<input id="line_1" onChange={this.props.handleChange} type="text"/>
					Address Line 2
					<input id="line_2" onChange={this.props.handleChange} />
					City
					<input id="city" onChange={this.props.handleChange}/> 
					State/Province/Region
					<input id="state" onChange={this.props.handleChange}/> 
					Zip
					<input id="zip" onChange={this.props.handleChange}/>
					Country
					<input id="country" onChange={this.props.handleChange}/>
					<button onClick={this.props.setAddress}>Set Address</button>
					<button onClick={this.closeModal}>Close</button>
				</Modal>
			</div>
    	);
  }
}