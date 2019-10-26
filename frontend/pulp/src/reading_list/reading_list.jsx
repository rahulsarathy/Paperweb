import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from './Components.jsx'

export default class ReadingList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      test: "hi"
    };
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
      </div>
    </div>);
  }
}

ReactDOM.render(<ReadingList/>, document.getElementById('reading_list'))
