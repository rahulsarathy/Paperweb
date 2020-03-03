import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { ReadingListItem, AddArticle } from "./components.jsx";
import { Modal, Button } from "react-bootstrap";

const static_url = "../static/images/";

export default class NoArticles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDid;

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
        <button className="pocket">
          <img className="pocket-image" src={static_url + "pocket_logo.svg"} />
        </button>
        <button className="instapaper">
          <img
            className="instapaper-image"
            src={static_url + "instapaper_logo.png"}
          />
          Instapaper
        </button>
        <p>Or add an article directly</p>
        <button onClick={this.props.onClick} className="add-article-button">
          Add Article
        </button>
      </div>
    );
  }
}
