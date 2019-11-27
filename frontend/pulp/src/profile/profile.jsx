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

class SubHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div>
      <h2>{this.props.title}</h2>
      <hr></hr>
    </div>);
  }
}

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.cancelPayment = this.cancelPayment.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      archive_links: false,
      paid: false,
      oldest: false,
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      zip: ''
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
        <div id="contact" className="subsection">
          <SubHeader title="Contact Info"/>
          <label>
            <b>{"Email: "}
            </b>
            {email}</label>
        </div>
        <div id="subscription" className="subsection">
          <SubHeader title="Subscription Info"/>
          <label>You are not subscribed to pulp</label>
          <button>Subscribe</button>
        </div>
        <SubHeader title="Invite Codes"/>
        <div id="address" className="subsection">
          <SubHeader title="Delivery Info"/>
          <label>You have not yet set an address</label>
          <input name="address_line_1" placeholder="Address Line 1"></input>
          <input name="address_line_2" placeholder="Address Line 2"></input>
          <input name="city" placeholder="City"></input>
          <input name="state" placeholder="State"></input>
          <input name="zip" placeholder="Zip"></input>
          <button>Update address</button>
        </div>

        <div id="delivery" className="subsection">
          <SubHeader title="Delivery Settings"/>
          <div id="archive_links">
            <label>
              <input name="archive_links" type="checkbox" checked={this.state.archive_links} onChange={this.handleInputChange}/>
              Archive links once they are delivered</label>
          </div>
          <div id="sortby">
            <label>Deliver
            </label>
            <select name="sort" onChange={this.handleChange}>
              <option value="oldest">oldest</option>
              <option value="newest">newest</option>
            </select>
            <label>articles first
            </label>
          </div>
        </div>
        <div id="password" className="subsection">
          <SubHeader title="Security"/>
          <a href="../accounts/password/change">Change Password</a>
        </div>
      </div>
    </div>);
  }
}

ReactDOM.render(<Profile/>, document.getElementById('profile'))
