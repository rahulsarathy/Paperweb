import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Autocomplete from 'react-google-autocomplete';

export default class Address extends React.Component {

	constructor(props) {
		super(props);

		this.setAddress = this.setAddress.bind(this);
		this.getAddress = this.getAddress.bind(this);

		this.state = {
			addresses: []
		};
	}

	componentDidMount() {
		this.getAddress()
	}

	setAddress(address)
	{
		console.log(address)
		// var address_components = address['address_components']
		// console.log(address_components)
		var csrftoken = $("[name=csrfmiddlewaretoken]").val();
		var data = {
			"address": address[0].long_name,
			"street": address[1].long_name,
			"city": address[2].long_name,
			"zip": address[7].long_name,
			"country": address[6].short_name,
			"state": address[5].short_name,
			csrfmiddlewaretoken: csrftoken,
		}

		$.ajax(
			{
				type: 'POST',
				data: data,
				url: '../api/users/set_address/',
				success: function(data)
					{
						this.setState(
							{
								address: address,
							});
					}.bind(this)
			});


	}

	getAddress() {
		$.ajax({
			type: 'GET',
			url: '../api/users/get_address/',
			success: function(data) {
				this.setState({
					address: data
				});
			}.bind(this)
		});
	}

	render () {
		// const addresses = this.createAddresses()

		return (
			<div className="">
				<h2>Your Shipping Address</h2>
				<Autocomplete
				style={{width: '90%'}}
				onPlaceSelected={(place) => {
					var address_array = place.address_components
					this.setAddress(address_array)
				}}
				types={['address']}
				/>
			</div>
    	);
  }
}