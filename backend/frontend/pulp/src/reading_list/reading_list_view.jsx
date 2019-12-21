import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {ReadingListItem} from './components.jsx';

export default class ReadingListView extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.archiveArticle = this.archiveArticle.bind(this);

    this.state = {
      value: "",
      invalid_url: false
    };
  }

  removeArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/reading_list/remove_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        this.props.updateReadingList(data);
      }.bind(this)
    });
  }

  archiveArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/reading_list/archive_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        console.log(data);
        this.props.updateReadingList(data);
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
      url: '../api/reading_list/add_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        this.props.updateReadingList(data);
        // this.setState({value: ''});
      }.bind(this),
      error: function(xhr) {
        if (xhr.responseText == 'Invalid URL') {
          this.setState({invalid_url: true});
        }
      }.bind(this)
    });
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  render() {
    return (<div className="readinglist">
      <h1>Your Print List</h1>
      {
        this.state.invalid_url
          ? <h3>Invalid URL</h3>
          : <div></div>
      }
      <div className="add-article">
        <button onClick={this.addToList}>+</button>
        <input placeholder="Input an article URL" value={this.state.value} onChange={this.handleChange}></input>
      </div>
      {
        this.props.reading_list.length === 0
          ? <p className="no-articles">No articles currently saved</p>
          : <div></div>
      }
      <div className="reading-list-items">
        {this.props.reading_list.map((reading_list_item, index) => <ReadingListItem key={index} added={reading_list_item.date_added} archiveArticle={this.archiveArticle} removeArticle={this.removeArticle} article={reading_list_item.article}/>)}
      </div>
    </div>);
  }

}
