import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col, Modal, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {} from './components.jsx';

function pages_compare(a, b) {
  if (a.article.word_count > b.article.word_count)
    return 1;
  if (b.article.word_count > a.article.word_count)
    return -1;
  return 0;
}

function deliver_compare(a, b) {
  if (a.to_deliver) {
    // If both are set to_deliver, compare by date
    if (b.to_deliver) {
      return date_compare(a, b);
    }
    return 1;
  }
  if (b.to_deliver) {
    return -1;
  }
  return 0;
}

function date_compare(a, b) {
  let date_a = new Date(a.date_added);
  let date_b = new Date(b.date_added);
  if (date_a > date_b)
    return 1;
  if (date_b > date_a)
    return -1;
  return 0;
}

function title_compare(a, b) {
  if (a.article.title > b.article.title)
    return 1;
  if (b.article.title > a.article.title)
    return -1;
  return 0;
}

export default class Delivery extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  createTable(sort) {
    let reading_list = this.props.reading_list;
    let sorted;
    if (sort === 'deliver') {
      sorted = this.props.reading_list.sort(deliver_compare);
    }
    if (sort === 'date_added') {
      console.log("date added");
      sorted = this.props.reading_list.sort(date_compare);
    }
    return sorted;
  }

  render() {
    this.createTable("date_added");
    return (<div className="delivery">
      <h1>Delivery Management</h1>
      <hr></hr>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>To Deliver?</th>
            <th>Number of Pages</th>
            <th>Date Added</th>
          </tr>
          {
            this.props.reading_list.map((rlist_item) => <tr key={rlist_item.article.title}>
              <td>{rlist_item.article.title}</td>
              <td>{rlist_item.to_deliver}</td>
              <td>{rlist_item.article.word_count}</td>
              <td>{rlist_item.date_added}</td>
            </tr>)
          }
        </thead>
      </table>
    </div>);
  }
}

// ReactDOM.render(<Delivery/>, document.getElementById('reading_list'))
