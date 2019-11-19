import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from './Components.jsx';

class ReadingListItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleHover = this.handleHover.bind(this);
    this.handleUnhover = this.handleUnhover.bind(this);

    this.state = {};
  }

  getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
  }

  handleHover() {
    this.setState({hovered: true});
  }

  handleUnhover() {
    this.setState({hovered: false});
  }

  render() {
    const {article, added, index} = this.props;
    let host = this.getLocation(article.permalink)
    let href = '../articles/?url=' + encodeURIComponent(article.permalink)
    return (<div className="container">
      <div className="readinglist-item" draggable="True" onMouseEnter={this.handleHover} onMouseLeave={this.handleUnhover}>
        <h3>
          <a target="_blank" href={href}>{article.title}</a>
        </h3>
        <p>
          <a target="_blank" href={article.permalink}>{host}</a>
        </p>
        <p>{article.excerpt}</p>
        {
          this.state.hovered
            ? (<div>
              <button onClick={() => this.props.removeArticle(article.permalink)}>Remove</button>
            </div>)
            : <div>Added on {added}</div>
        }
      </div>
      <div className="gradient"></div>
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
      invalid_url: false,
      show_article: false,
      article_data: {}
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
      url: '../api/reading_list/remove_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        this.setState({reading_list: data});
      }.bind(this)
    });
  }

  getReadingList() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/reading_list/get_reading',
      data: data,
      type: 'GET',
      success: function(data) {
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
      url: '../api/reading_list/add_reading',
      data: data,
      type: 'POST',
      success: function(data) {
        this.setState({reading_list: data});
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
      <Row className="readinglist">
        <Col>
          <h1>Your Reading List</h1>
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
            this.state.reading_list.length === 0
              ? <p className="no-articles">No articles currently saved</p>
              : <div></div>
          }
          <div className="reading-list-items">
            {this.state.reading_list.map((reading_list_item, index) => <ReadingListItem key={index} added={reading_list_item.date_added} removeArticle={this.removeArticle} article={reading_list_item.article}/>)}
          </div>
        </Col>
      </Row>
    </div>);
  }
}

ReactDOM.render(<ReadingList/>, document.getElementById('reading_list'))
