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

  render() {
    return (
      <div className="no-articles">
        <img className="pulp-gray" src={static_url + "pulp_gray_logo.svg"} />
        <p className="empty">Your reading list is empty</p>
        <p>Sync Pulp with your already existing reading lists</p>
        <Pocket_Modal />
        <Instapaper_Pane />
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
