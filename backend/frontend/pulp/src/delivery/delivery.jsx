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

    this.changeSort = this.changeSort.bind(this);
    this.state = {
      sort: 'date_added',
    };
  }

  getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
  }

  changeSort(sort) {
    this.setState({
      sort: sort,
    });
  }


  createTable() {
    let reading_list = this.props.reading_list;
    let sorted;
    if (this.state.sort === 'deliver') {
      sorted = this.props.reading_list.sort(deliver_compare);
    }
    if (this.state.sort === 'date_added') {
      sorted = this.props.reading_list.sort(date_compare);
    }
    if (this.state.sort === 'title') {
      sorted = this.props.reading_list.sort(title_compare);
    }
    if (this.state.sort === 'pages_compare') {
      sorted = this.props.reading_list.sort(pages_compare);
    }
    return sorted.map((rlist_item) => <tr key={rlist_item.article.title}>
      <td>{rlist_item.article.title}
        {this.getLocation(rlist_item.article.permalink)}</td>
      <td>
        <input type="checkbox" onChange={() => this.props.changeDeliver(rlist_item)} checked={rlist_item.to_deliver}/>
      </td>
      <td>{rlist_item.article.word_count}</td>
      <td>{rlist_item.date_added}</td>
    </tr>)
  }

  render() {
    return (<div className="delivery">
      <h1>Delivery Management</h1>
      <hr></hr>
      <table>
        <thead>
          <tr>
            <th onClick={() => this.changeSort("title")}>Title</th>
            <th onClick={() => this.changeSort("deliver")}>To Deliver?</th>
            <th onClick={() => this.changeSort("pages_compare")}>Number of Pages</th>
            <th onClick={() => this.changeSort("date_added")}>Date Added</th>
          </tr>
          {this.createTable()}
        </thead>
      </table>
    </div>);
  }
}

// ReactDOM.render(<Delivery/>, document.getElementById('reading_list'))
