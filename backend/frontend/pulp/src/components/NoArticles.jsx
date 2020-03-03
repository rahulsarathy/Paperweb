import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { Instapaper_Pane, Pocket_Modal } from "./components.jsx";
import { Modal, Button } from "react-bootstrap";

const static_url = "../static/images/";

export default class NoArticles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        {this.props.length === 0 ? (
          <Content onClick={this.props.onClick} />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.getServices();
  }

  getServices() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();

    $.ajax({
      url: "../api/reading_list/services_status",
      type: "GET",
      success: function(data) {
        this.setState({
          pocket: data.pocket,
          instapaper: data.instapaper
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div className="no-articles">
        <img className="pulp-gray" src={static_url + "pulp_gray_logo.svg"} />
        <p className="empty">Your reading list is empty</p>
        <p>Sync Pulp with your already existing reading lists</p>
        <Pocket_Modal data={this.state.pocket} />
        <Instapaper_Pane data={this.state.instapaper} />
        <p>Or add an article directly</p>
        <button
          onClick={this.props.onClick}
          className="integration-button add-article-button"
        >
          Add Article
        </button>
      </div>
    );
  }
}
