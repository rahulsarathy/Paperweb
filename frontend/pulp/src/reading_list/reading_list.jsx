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
        <h1>Reading List</h1>
      </div>
    </div>);
  }
}

ReactDOM.render(<ReadingList/>, document.getElementById('reading_list'))
