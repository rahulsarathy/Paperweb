import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
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
    let author_text;
    article_json.author === null || article_json.author === '' ? author_text = '' : author_text = 'By ' + article_json.author
    return (<div>
      <div className="article">
          <h1>{article_json.title}</h1>
          <p className="author">{author_text}</p>
          <div className="content" dangerouslySetInnerHTML={this.createMarkup()}></div>
      </div>
    </div>);
  }
}

ReactDOM.render(<Article/>, document.getElementById('article'))
