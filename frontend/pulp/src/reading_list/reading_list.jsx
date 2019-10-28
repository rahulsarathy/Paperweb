import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from './Components.jsx'

class ReadingListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    return (<div>

    </div>);
  }
}

export default class ReadingList extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.addToList = this.addToList.bind(this);

    this.state = {
      value: "",
      items: [],
    };
  }

  addToList() {
    console.log(this.state.value);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
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
        <input value={this.state.value} onChange={this.handleChange}>
        </input>
        <button onClick={this.addToList}>Add to list</button>
      </div>
    </div>);
  }
}

ReactDOM.render(<ReadingList/>, document.getElementById('reading_list'))
