import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import {Row, Col} from 'react-bootstrap';
import {Header} from './Components.jsx';

// article_json is passed to the dom
export default class Article extends React.Component {

  constructor(props) {
    document.title = article_json.title
    super(props);
  }

  createMarkup() {
    return {__html: article_json.content};
  }

  render() {
    return (<div>
      <Row className="article">
        <Col>
          <h1>{article_json.title}</h1>
          <p>By {article_json.author}</p>
          <div dangerouslySetInnerHTML={this.createMarkup()}></div>
        </Col>
      </Row>
    </div>);
  }
}

ReactDOM.render(<Article/>, document.getElementById('article'))
