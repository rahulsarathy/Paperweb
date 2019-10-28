import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from './Components.jsx'

class ReadingListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {article} = this.props;
    return (<div>
      <h3>{article.title}</h3>
      <button onClick={() => this.props.removeArticle(article.link)}>Remove</button>
    </div>);
  }
}

export default class ReadingList extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeArticle = this.removeArticle.bind(this);

    this.state = {
      value: "",
      reading_list: [],
      invalid_url: false
    };
  }

  componentDidMount() {
    this.getReadingList();
  }

  removeArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/blogs/remove_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  getReadingList() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/blogs/get_reading',
      data: data,
      type: 'GET',
      success: function(data) {
        console.log(data);
        this.setState({reading_list: data});
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
      url: '../api/blogs/add_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        let reading_list = this.state.reading_list;
        reading_list.push(data);
        this.setState({reading_list: reading_list});
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

    return (<div>
      <Header/>
      <div className="readinglist">
        <div className="row">
          <div className="column"></div>
        </div>
        <h1>Reading List</h1>
        <h3>Add to Reading List</h3>
        {
          this.state.invalid_url
            ? <h3>Invalid URL</h3>
            : <div></div>
        }
        <div className="add-article">
          <input placeholder="Add an article" value={this.state.value} onChange={this.handleChange}></input>
          <button onClick={this.addToList}>Add to list</button>
        </div>
        <h2>Your Reading List</h2>
        {this.state.reading_list.map((article) => <ReadingListItem removeArticle={this.removeArticle} key={article.link} article={article}/>)}
      </div>
    </div>);
  }
}

ReactDOM.render(<ReadingList/>, document.getElementById('reading_list'))
