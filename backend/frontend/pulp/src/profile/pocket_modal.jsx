import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import {Modal} from 'react-bootstrap';
import {

} from './components.jsx'

export default class Pocket_Modal extends React.Component {

  constructor(props) {
    super(props);

    this.showPane = this.showPane.bind(this);
    this.hidePane = this.hidePane.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.importFromPocket = this.importFromPocket.bind(this);

    this.state = {
      show: false,
    };
  }

  showPane() {
    this.setState({
      show: true,
    });
  }

  hidePane() {
    this.setState({
      show: false,
    });
  }

  handleChange(e) {
    var field = e.target.id;
    this.setState({
      [field]: e.target.value
    });
  }

  importFromPocket() {

  }


  render() {

    return (
      <div>
        <button onClick={this.showPane}>Import from Pocket</button>
        <Modal show={this.state.show} onHide={this.hidePane}>
          <h2>Sign into Pocket</h2>
          Username
          <input id="username" onChange={this.handleChange}></input>
          Password
          <input id="password"></input>
          <Modal.Footer>
            <button onClick={() => this.importFromPocket(this.state.username, this.state.password)}>Import from Pocket</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
