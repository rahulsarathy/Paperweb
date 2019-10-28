import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col} from 'react-bootstrap';
import {Authors, AboutAuthor} from './Components.jsx';

export default class Overview extends React.Component {

  constructor(props) {
    super(props);
    // this.getBlogPosts = this.getBlogPosts.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    this.state = {
      posts: [],
      selected_author: 0,
    };
  }

  componentDidMount() {
    // this.getBlogPosts();
    this.checkSubStatus();
  }

  checkSubStatus() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    var data = {
      csrfmiddlewaretoken: csrftoken,
      name_id: this.props.blog.name_id
    }
    $.ajax({
      url: '/api/blogs/check_sub_status/',
      type: 'POST',
      data: data,
      success: function(data) {
        if (data) {
          this.setState({subscribed: true});
        }
      }.bind(this)
    });
  }


  unsubscribe() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      url: '/api/blogs/unsubscribe/',
      type: 'POST',
      data: {
        name_id: this.props.blog.name_id,
        csrfmiddlewaretoken: csrftoken
      },
      success: function(data, xhr) {
        this.setState({subscribed: false});
      }.bind(this)
    });
  }

  subscribe() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      url: '/api/blogs/subscribe/',
      type: 'POST',
      data: {
        name_id: this.props.blog.name_id,
        csrfmiddlewaretoken: csrftoken
      },
      success: function(data, xhr) {
        this.setState({subscribed: true});
      }.bind(this)
    });
  }

  getBlogPosts() {
    const { blog } = this.props;
    let blog_id = blog.name_id;
    let data = {
      blog_id: blog_id,
    }
    $.ajax({
      url: '/api/blogs/get_blog_posts',
      type: 'GET',
      data: data,
      success: function(data) {
        this.setState({
          posts: data
        });
      }.bind(this)
    });
  }


  render() {
    const { blog } = this.props;
    console.log(blog);
    return (<div className="overview">
      <h1>{blog.display_name}</h1>
      <Row>
        <Col>
          <About about={blog.about}/> {
            this.state.subscribed
              ? <button onClick={this.unsubscribe} className="subscribe-button">unsubscribe</button>
              : <button onClick={this.subscribe} className="subscribe-button">subscribe</button>
          }
        </Col>
        <Col>
          <AboutAuthor num_authors={blog.authors.length} nextAuthor={this.nextAuthor} author={blog.authors[this.state.selected_author]}/>
        </Col>
      </Row>
    </div>);
  }
}

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className="about">
      <h2>About</h2>
      <p>{this.props.about}</p>
    </div>)
  }
}
