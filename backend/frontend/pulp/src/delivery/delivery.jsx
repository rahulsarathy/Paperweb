import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Table, DropdownButton, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {NoArticles} from '../switcher/components.jsx';
import {Checkbox} from './components.jsx';

function pages_compare(a, b) {
  if (a.article.word_count > b.article.word_count)
    return -1;
  if (b.article.word_count > a.article.word_count)
    return 1;
  return 0;
}

function deliver_compare(a, b) {
  if (a.to_deliver) {
    // If both are set to_deliver, compare by date
    if (b.to_deliver) {
      return date_compare(a, b);
    }
    return -1;
  }
  if (b.to_deliver) {
    return 1;
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
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      sort: 'date_added',
      // search: undefined,
    };
  }

  getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
  }

  changeSort(sort) {
    this.setState({sort: sort});
  }

  chooseSort() {
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
    return sorted;
  }

  createTable() {
    let search = this.state.search;
    let reading_list = this.props.reading_list;
    let sorted = this.chooseSort();
    let filtered = [];
    for (let i = 0; i < sorted.length; i++) {
      if (search === undefined || sorted[i].article.title.toLowerCase().includes(search.toLowerCase())) {
        filtered.push(sorted[i]);
      }
    }

    return filtered.map((rlist_item) => <tr key={rlist_item.article.title}>
      <td>
        <p className="title">{rlist_item.article.title}</p>
        <p className="domain">{this.getLocation(rlist_item.article.permalink)}</p>
      </td>
      <td className="to-deliver">
        <input type="checkbox" onChange={() => this.props.changeDeliver(rlist_item)} checked={rlist_item.to_deliver}/>
      </td>
      <td className="">{rlist_item.article.word_count}</td>
      <td className="rightmost">{(new Date(rlist_item.date_added)).toDateString().split(' ').slice(1).join(' ')}</td>
    </tr>)
  }

  handleSearch(e) {
    this.setState({search: e.target.value});
  }

  changeSortLabel() {
    switch (this.state.sort) {
      case 'title':
        return 'Title';
      case 'deliver':
        return 'To Deliver?';
      case 'pages_compare':
        return 'Number of Pages';
      case 'date_added':
        return 'Date Added';
      default:
        return 'Title';
    }
  }

  render() {
    return (<div className="delivery">
      <h1>Delivery Management</h1>
      <hr></hr>
      {
        this.props.reading_list.length === 0
          ? <NoArticles/>
          : <div>
              <div className="filter">
                <input placeholder="Search" type="text" onChange={this.handleSearch}/>
              </div>
              <label className="sort-label">Sort By</label>
              <DropdownButton className="sort-button" title={this.changeSortLabel()}>
                <Dropdown.Item onClick={() => this.changeSort("title")}>Title</Dropdown.Item>
                <Dropdown.Item onClick={() => this.changeSort("deliver")}>To Deliver?</Dropdown.Item>
                <Dropdown.Item onClick={() => this.changeSort("pages_compare")}>Number of Pages</Dropdown.Item>
                <Dropdown.Item onClick={() => this.changeSort("date_added")}>Date Added</Dropdown.Item>
              </DropdownButton>
              <Checkbox/>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>To Deliver?</th>
                      <th>Number of Pages</th>
                      <th className="rightmost">Date Added</th>
                    </tr>
                    {this.createTable()}
                  </thead>
                </table>
              </div>
            </div>
      }

    </div>);
  }
}

// ReactDOM.render(<Delivery/>, document.getElementById('reading_list'))
