import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

var placeSearch, autocomplete;

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

export default class Address extends React.Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.setAddress = this.setAddress.bind(this);

		this.state = {
			value: '',
			addresses: []
		};
	}

	componentDidMount() {
	}

	componentDidUpdate() {
		// this.getAddresses()
	}

	handleChange(e) {

		this.setState({
			value: e.target.value
		});

	}

	setAddress(e)
	{
		var address = e.target.innerText
		var data = {
			address: address
		}

		$.ajax(
			{
				type: 'POST',
				data: data,
				url: '/set_address',
				success: function(data)
					{
						this.setState(
							{
								address: address,
								value: address
							});
					}.bind(this)
			});


	}

	createAddresses() {
		var addressItems;
		if (!this.state.value || this.state.value <= 2)
		{
			addressItems = [];
		}
		else {
			const addresses = this.state.addresses;
			addressItems = addresses.map((address) =>
				(
					<div className="address" onClick={this.setAddress}>
						<li>{address}</li>
					</div>
					)
			);
		}

		return addressItems;
	}

	// getAddresses(address) {

	// 	var data = {
	// 		address: address
	// 	}

	// 	$.ajax(
	// 		{
	// 			url: '/autocomplete',
	// 			type: 'POST',
	// 			data: data,
	// 			success: function(data, statusText, xhr)
	// 			{
	// 				this.setState(
	// 					{
	// 						addresses: JSON.parse(data)
	// 					});
	// 			}.bind(this)
	// 		});
	// }

	render () {
		// const addresses = this.createAddresses()

		return (
			<div className="">
				<h2>Your Shipping Address</h2>
				{this.state.address}
				<input id="autocomplete" className="address-field" onChange={this.handleChange} value={this.state.value} type="text"/>
			</div>
    	);
  }
}