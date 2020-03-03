import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {
  ReadingListItem,
  NoArticles,
  AddArticle,
  ReadingListItems,
  Pages
} from "./components.jsx";
import { Modal, Button } from "react-bootstrap";

export default class ReadingListView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.archiveArticle = this.archiveArticle.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getReadingList.bind(this);

    this.state = {
      value: "",
      invalid_url: false,
      show_add: false,
      page: 0,
      reading_list: []
    };
  }

  componentDidMount() {
    this.getReadingList();
  }

  getReadingList() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/get_reading",
      data: data,
      type: "GET",
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  showModal() {
    this.setState({
      show_add: true
    });
  }

  handleClose() {
    this.setState({
      show_add: false
    });
  }

  removeArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/remove_reading",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  archiveArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    };

    $.ajax({
      url: "../api/reading_list/archive_reading",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  addToList() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: this.state.value,
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/add_reading",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data,
          show_add: false
        });
      }.bind(this),
      error: function(xhr) {
        if (xhr.responseText == "Invalid URL") {
          this.setState({
            invalid_url: true,
            show_add: false
          });
        }
      }.bind(this)
    });
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <div className="readinglist">
        {this.state.invalid_url ? <h3>Invalid URL</h3> : <div></div>}
        <h1>Your Print List</h1>
        <AddArticle
          onClick={this.showModal}
          addToList={this.addToList}
          value={this.state.value}
          onChange={this.handleChange}
          show={this.state.show_add}
          handleClose={this.handleClose}
          empty={this.state.reading_list.length === 0}
        />
        <hr></hr>
        <NoArticles
          onClick={this.showModal}
          length={this.state.reading_list.length}
        />
        <ReadingListItems
          reading_list={this.state.reading_list}
          archiveArticle={this.archiveArticle}
          removeArticle={this.removeArticle}
          page={this.state.page}
        />
      </div>
    );
  }
}
