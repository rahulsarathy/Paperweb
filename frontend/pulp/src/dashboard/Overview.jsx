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

    this.state = {
      selected_author: 0,
    };
  }

  nextAuthor() {
    if (this.state.selected_author === this.props.blog.authors.length - 1) {
      this.setState({selected_author: 0});
    } else {
      this.setState({
        selected_author: this.state.selected_author + 1
      });
    }
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
