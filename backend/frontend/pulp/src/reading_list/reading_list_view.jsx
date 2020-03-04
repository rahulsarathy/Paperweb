import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {
  ReadingListItem,
  NoArticles,
  ReadingListItems,
  Pages
} from "./components.jsx";
import { Modal, Button } from "react-bootstrap";

export default class ReadingListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    };
  }

  render() {
    return (
      <div className="readinglist">
        {this.state.invalid_url ? <h3>Invalid URL</h3> : <div></div>}
        <h1>Your Print List</h1>
        {!this.props.empty ? (
          <button
            className="top-add-article-button"
            onClick={this.props.showModal}
          >
            Add Article
          </button>
        ) : (
          <div></div>
        )}
        <hr></hr>
        <NoArticles
          showModal={this.props.showModal}
          pocket={this.props.pocket}
          instapaper={this.props.instapaper}
          empty={this.props.empty}
          loading_list={this.props.loading_list}
        />
        <ReadingListItems
          reading_list={this.props.reading_list}
          removeArticle={this.props.removeArticle}
          page={this.state.page}
          archiveArticle={this.props.archiveArticle}
        />
      </div>
    );
  }
}
