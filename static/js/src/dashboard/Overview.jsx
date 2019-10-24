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
    this.getBlogPosts = this.getBlogPosts.bind(this);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.getBlogPosts();
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
        console.log(data);
        this.setState({
          posts: data
        });
      }.bind(this)
    });
  }


  render() {
    const { blog } = this.props;

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
