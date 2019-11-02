import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from './Components.jsx';

class ReadingListItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleHover = this.handleHover.bind(this);
    this.handleUnhover = this.handleUnhover.bind(this);
    this.showArticle = this.showArticle.bind(this);

    this.state = {
      hovered: false,
      showArticle: false,
      html: ''
    };
  }

  getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
  }

  getURL() {
    $.ajax({
      type: 'POST',
      url: '../api/blogs/get_html',
      success: function(data) {
        this.setState({html: data});
      }.bind(this)
    });
  }

  handleHover() {
    this.setState({hovered: true});
  }

  handleUnhover() {
    this.setState({hovered: false});
  }

  showArticle() {
    const {article} = this.props;
    var html;
    let url = article.link;
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      url: url,
      csrfmiddlewaretoken: csrftoken
    }

  }

render() {
  const {article} = this.props;
  let host = this.getLocation(article.link)
  return (<div onMouseEnter={this.handleHover} onMouseLeave={this.handleUnhover}>
    <h3 onClick={this.showArticle}>{article.title}</h3>
    <p>{host}</p>
    {
      this.state.hovered
        ? (<div>
          <button onClick={() => this.props.removeArticle(article.link)}>Remove</button>
          <button>Archive</button>
        </div>)
        : <div></div>
    }
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
    <Row className="readinglist">
      <Col md={2}>
        <button>Archive</button>
        <button>Edit Reading List</button>
      </Col>
      <Col md={10}>
        {
          this.state.invalid_url
            ? <h3>Invalid URL</h3>
            : <div></div>
        }
        <div className="add-article">
          <button onClick={this.addToList}>+</button>
          <input placeholder="Add an article" value={this.state.value} onChange={this.handleChange}></input>
        </div>
        {
          this.state.reading_list.length === 0
            ? <p>No articles saved</p>
            : <div></div>
        }
        {this.state.reading_list.map((article) => <ReadingListItem removeArticle={this.removeArticle} key={article.link} article={article}/>)}
      </Col>
    </Row>
  </div>);
}
}

ReactDOM.render(<ReadingList/>, document.getElementById('reading_list'))
