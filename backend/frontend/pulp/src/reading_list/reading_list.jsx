import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from './components.jsx';

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
    let mercury_response = article.mercury_response;
    let host = this.getLocation(article.permalink)
    let href = '../articles/?url=' + encodeURIComponent(article.permalink)
    let has_image = false;
    let style = {}
    mercury_response.lead_image_url
      ? has_image = true
      : has_image = false
    if (!has_image) {
      style = {
        width: '125%'
      }
    }
    return (<div className="readinglist-item-container" style={style}>
      <div className="readinglist-item" onMouseEnter={this.handleHover} onMouseLeave={this.handleUnhover}>
        <h3>
          <a target="_blank" href={href}>{article.title}</a>
        </h3>
        <div className="extras">
          <div className="domain">
            <a target="_blank" href={article.permalink}>{host}</a>
          </div>
          <div className="author">
            {
              mercury_response.author
                ? <p className="author_text">{'by ' + mercury_response.author}</p>
                : ''
            }
          </div>
        </div>
        {
          this.state.hovered
            ? (<div className="hover-section">
              <button onClick={() => this.props.removeArticle(article.permalink)}>Remove</button>
            </div>)
            : <div className="hover-section">
                <p className="date-added">Added on {added.split('T')[0]}</p>
              </div>
        }
        <div className="faded-content">
          <div className="content">
            <p>{mercury_response.parsed_text}</p>
          </div>
          <div className="gradient"></div>
        </div>
        {
          has_image
            ? <img className="first-image" src={mercury_response.lead_image_url}/>
            : <div></div>
        }
      </div>
    </div>);
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    let className;
    let image_url = '/static/icons/' + this.props.value + '.svg'
    this.props.selected === this.props.value
      ? className = 'menu-item-selected'
      : className = "menu-item"

    return (<div className={className} onClick={this.props.onClick}>
      {
        this.props.value === 'unread'
          ? (<div className="unread"><div className="number">{this.props.unread}</div></div>)
          : (<img className="icon" src={image_url}/>)
      }
      {this.props.text}
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
      article_data: {},
      selected: 'unread'
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
        this.setState({reading_list: data, value: ''});
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

  changeSelected(value) {
    this.setState({selected: value});
  }

  render() {

    return (<div>
      <Row className="readinglist-container">
        <Col className="sidebar">
          <MenuItem onClick={() => this.changeSelected("unread")} unread={this.state.reading_list.length} selected={this.state.selected} value="unread" text={"Unread"}/>
          <MenuItem onClick={() => this.changeSelected("archive")} selected={this.state.selected} value="archive" text={"Archive"}/>
          <MenuItem onClick={() => this.changeSelected("settings")} selected={this.state.selected} value="settings" text={"Settings"}/>
        </Col>
        <Col className="readinglist">
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
