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
		this.getAddress = this.getAddress.bind(this);

		this.state = {
			value: '',
			addresses: []
		};
	}

	componentDidMount() {
		this.getAddress()
	}

	handleChange(e) {

		this.setState({
			value: e.target.value
		});

	}

	setAddress()
	{
		var csrftoken = $("[name=csrfmiddlewaretoken]").val();
		var address = this.state.value
		var data = {
			address: address,
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
				{this.state.address}
				<input id="autocomplete" className="address-field" onChange={this.handleChange} value={this.state.value} type="text"/>
				<button onClick={this.setAddress}>Set Address</button>
			</div>
    	);
  }
}