import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { ArchiveItem, NoArticles } from "./components.jsx";

function getLocation(href) {
  var l = document.createElement("a");
  l.href = href;
  return l.hostname;
}

export default class Archive extends React.Component {
  constructor(props) {
    super(props);
    this.getArchive = this.getArchive.bind(this);

    this.state = {
      archive_list: []
    };
  }

  componentDidMount() {
    this.getArchive();
  }

  getArchive() {
    $.ajax({
      url: "../api/reading_list/get_archive",
      success: function(data) {
        this.setState({ archive_list: data });
      }.bind(this)
    });
  }

  unArchive() {
    $.ajax({
      url: "../api/reading_list/unarchive",
      success: function(data) {
        this.setState({ archive_list: data });
      }.bind(this)
    });
  }

  createTable() {
    let archive_list = this.state.archive_list;
    return archive_list.map(alist_item => (
      <tr key={alist_item.article.title}>
        <td>
          <p className="title">{alist_item.article.title}</p>
        </td>
        <td>
          <p className="site"></p>
        </td>
        <td>
          <p></p>
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <div className="archive-body">
        <h1>Your Archived Articles</h1>
        <hr></hr>
        <div className="reading-list-items">
          {this.state.archive_list.length === 0 ? (
            <NoArticles />
          ) : (
            <div>
              {this.state.archive_list.map((archive_list_item, index) => (
                <ArchiveItem
                  key={index}
                  added={archive_list_item.date_added}
                  archiveArticle={this.archiveArticle}
                  removeArticle={this.removeArticle}
                  article={archive_list_item.article}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
