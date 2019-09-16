import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

export default class Address_Pane extends React.Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.setAddress = this.setAddress.bind(this);
		this.getAddress = this.getAddress.bind(this);

		this.state = {
			address: '',
			line_1: '',
			line_2: '',
			city: '',
			state: '',
			zip: '',
			country: '',
		};
	}

	componentDidMount() {
		this.getAddress()
	}

	handleChange(e){
		var field = e.target.id;
		this.setState({
			[field]: e.target.value
		});
	}

	setAddress()
	{
		var csrftoken = $("[name=csrfmiddlewaretoken]").val();
		var address_json = {
			line_1: this.state.line_1,
			line_2: this.state.line_2,
			city: this.state.city,
			state: this.state.state,
			zip: this.state.zip,
			country: this.state.country,
		}
		var data = {
			address_json: JSON.stringify(address_json),
			csrfmiddlewaretoken: csrftoken,
		}

		$.ajax(
			{
				type: 'POST',
				data: data,
				url: '../api/users/set_address/',
				success: function(data)
					{
						console.log(data)
						this.setState(
							{
								address: data,
							});
					}.bind(this)
			});

	}

	getAddress() {
		$.ajax({
			type: 'GET',
			url: '../api/users/get_address/',
			success: function(data) {
				console.log(data)
				this.setState({
					address: data
				});
			}.bind(this)
		});
	}

	render () {
		// const addresses = this.createAddresses()
		return (
			<div className="address_pane">
				<h1>Delivery Address</h1>
				{this.state.address == '' ? <h2>No Magazine</h2> : <h2>Your magazine will be delivered to</h2>}
				{this.state.address.line_1}
				Address Line 1
				<input 
				id="line_1" 
				onChange={this.handleChange} 
				value={this.state.value} 
				type="text"/>
				Address Line 2
				<input id="line_2" onChange={this.handleChange} />
				City
				<input id="city" onChange={this.handleChange}/> 
				State/Province/Region
				<input id="state" onChange={this.handleChange}/> 
				Zip
				<input id="zip" onChange={this.handleChange}/>
				Country
				<input id="country" onChange={this.handleChange}/>
				<button onClick={this.setAddress}>Set Address</button>
				<h1>Schedule</h1>
				<h3>Magazines will be delivered the 15th of every month</h3>
			</div>
    	);
  }
}