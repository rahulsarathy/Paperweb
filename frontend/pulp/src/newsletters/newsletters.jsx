import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import { Row, Col } from 'react-bootstrap';

export default class Newsletters extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onClick = this.onClick.bind(this);

		this.state = {
			newsletter_submit: ''
		};
	}

	handleChange(e) {
		this.setState({
			newsletter_submit: e.target.data,
		})
	}

	onClick(e) {
		let data = {
			newsletter: this.state.newsletter_submit
		}
		$.ajax({
			url: '../api/newsletters/add_newsletter',
			type: 'POST',
			data: data,
			success: function(data) {

			}
		});
	}

	render () {
    return (
        <div>
          <h1>Newsletters</h1>
					<input id="newsletter_submit" onChange={this.props.handleChange} type="text"/>
					<button>Subscribe to newsletter</button>
        </div>
    	);
  }
}


ReactDOM.render(<Newsletters/>, document.getElementById('newsletters'))
