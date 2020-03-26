import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import shortid from "shortid";
import classnames from "classnames";
import { Modal, Button } from "react-bootstrap";
import {} from "./components.jsx";

const static_url = "../static/images/";

export default class Pocket_Modal extends React.Component {
  constructor(props) {
    super(props);

    this.showPane = this.showPane.bind(this);
    this.hidePane = this.hidePane.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.importFromPocket = this.importFromPocket.bind(this);
    this.state = {
      show: false
    };
  }

  showPane() {
    this.setState({ show: true });
  }

  hidePane() {
    this.setState({ show: false });
  }

  handleChange(e) {
    var field = e.target.id;
    this.setState({ [field]: e.target.value });
  }

  importFromPocket() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      type: "POST",
      data: data,
      url: "../api/pocket/request_pocket",
      success: function(data) {
        window.location.href = data;
      },
      error: function(xhr) {
        console.log(xhr);
        console.log(xhr.responseText);
      }
    });
  }

  removeModal() {
    return (
      <Modal show={this.state.show} onHide={this.hidePane}>
        <h2>Pocket is integrated with Pulp</h2>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.removePocket}>
            Remove pocket integration
          </Button>
          <Button variant="secondary" onClick={this.hidePane}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  defaultModal() {
    return (
      <Modal show={this.state.show} onHide={this.hidePane}>
        <h2>Integrate Pulp with Pocket</h2>
        <Modal.Footer>
          <Button variant="primary" onClick={() => this.importFromPocket()}>
            Import from Pocket
          </Button>
          <Button variant="secondary" onClick={this.hidePane}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        <button className="integration-button pocket" onClick={this.showPane}>
          <img className="pocket-image" src={static_url + "pocket_logo.svg"} />
        </button>
        {this.props.signed_in ? this.removeModal() : this.defaultModal()}
      </div>
    );
  }
}
