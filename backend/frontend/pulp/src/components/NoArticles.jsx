import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { Instapaper_Pane, Pocket_Modal } from "./components.jsx";
import { Modal, Button } from "react-bootstrap";

const static_url = "../static/images/";

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
        <Pocket_Modal data={this.props.pocket} />
        <Instapaper_Pane data={this.props.instapaper} />
        <p>Or add an article directly</p>
        <button
          onClick={this.props.showModal}
          className="integration-button add-article-button"
        >
          Add Article
        </button>
      </div>
    );
  }
}

export default class NoArticles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    if (this.props.loading_list) {
      return <div></div>;
    }

    return (
      <div>
        {this.props.empty ? (
          <Content showModal={this.props.showModal} />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
