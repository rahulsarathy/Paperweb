import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import {Row, Col} from 'react-bootstrap';
import {
  Address_Pane,
  Payment_Pane,
  Cancel_Pane,
  Unpaid,
  Paid,
  Header
} from './Components.jsx'

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.cancelPayment = this.cancelPayment.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      changed: false,
      archive_links: false
    };
  }

  componentDidMount() {
    this.checkPaymentStatus();
  }

  checkPaymentStatus() {
    $.ajax({
      url: '../api/payments/payment_status',
      type: 'GET',
      success: function(data, statusText, xhr) {
        console.log(xhr)
        if (xhr.status == 208) {
          this.setState({paid: true});
        } else {
          this.setState({paid: false});
        }
      }.bind(this)
    });
  }

  cancelPayment() {
    $.ajax({
      url: '../api/payments/cancel_payment',
      type: 'GET',
      success: function(data, statusText, xhr) {
        this.setState({paid: false});
      }.bind(this)
    });
  }

  handleInputChange(e) {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({[name]: value, changed: true});
  }

  handleChange(e) {
    let name = e.target.name;
    this.setState({[name]: e.target.value, changed: true});
  }

  render() {

    return (<div>
      <Header/>
      <div className="profile">
        <h3>Your Info</h3>
        <p>
          <b>Email:</b>
          {email}
        </p>
        <div className="subscription-pane">
          <h3>Subscription Info</h3>
          <p>You are not subscribed</p>
					<div className="option">
						<p>Pulp - <b>6.99 / Month</b></p>
						<button>Subscribe</button>
					</div>
        </div>
        <div className="address">
					<h3>Delivery Info</h3>
          <label>
            <input name="address_1" placeholder='Address Line 1' value={this.state.address_1} onChange={this.handleChange}/>
          </label>
          <label>
            <input name="address_2" placeholder='Address Line 2' value={this.state.address_2} onChange={this.handleChange}/>
          </label>
          <label>
            <input name="street" placeholder={'Zip'} value={this.state.street} onChange={this.handleChange}/>
          </label>
          <label>
            <input name="street" placeholder={'State'} value={this.state.street} onChange={this.handleChange}/>
          </label>
          <label>
            <input name="street" placeholder={'City'} value={this.state.street} onChange={this.handleChange}/>
          </label>
        </div>
        <h3>Settings</h3>
        <label>
          <input name="archive_links" type="checkbox" checked={this.state.archive_links} onChange={this.handleInputChange}/>
          Archive links once they are delivered
        </label>
        <label>
          Deliver
          <select name="sort" onChange={this.handleChange}>
            <option value="oldest">oldest</option>
            <option value="newest">newest</option>
          </select>
          articles first
        </label>
      </div>
    </div>);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))
