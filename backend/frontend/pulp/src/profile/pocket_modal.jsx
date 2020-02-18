import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import {} from './components.jsx'

export default class Pocket_Modal extends React.Component {

  constructor(props) {
    super(props);

    this.showPane = this.showPane.bind(this);
    this.hidePane = this.hidePane.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.importFromPocket = this.importFromPocket.bind(this);
    let show;
    if (pocket) {
      show = true;
    } else {
      show = false;
    }

    this.state = {
      show: show,
    };
  }

  showPane() {
    this.setState({show: true});
  }

  hidePane() {
    pocket = false;
    this.setState({show: false});
  }

  handleChange(e) {
    var field = e.target.id;
    this.setState({[field]: e.target.value});
  }

  importFromPocket() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      type: 'POST',
      data: data,
      url: '../api/reading_list/pocket',
      success: function(data) {
        window.location.href = data;
      }
    });
  }

  render() {

    return (<div>
      <button onClick={this.showPane}>Import from Pocket</button>
      <Modal show={this.state.show} onHide={this.hidePane}>
        <h2>Import articles from Pocket</h2>
        {pocket ? <p>Import started. Your articles will be imported over the next half hour.</p>: <div></div>}
        <Modal.Footer>
          <Button variant="primary" onClick={() => this.importFromPocket(this.state.username, this.state.password)}>Import from Pocket</Button>
          <Button variant="secondary" onClick={this.hidePane}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>);
  }
}
