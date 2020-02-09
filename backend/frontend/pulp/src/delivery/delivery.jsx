import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Table, DropdownButton, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {NoArticles} from '../switcher/components.jsx';
import {Checkbox} from './components.jsx';

function getLocation(href) {
  var l = document.createElement("a");
  l.href = href;
  return l.hostname;
}

function pages_compare(a, b) {
  if (a.article.page_count > b.article.page_count)
    return -1;
  if (b.article.page_count > a.article.page_count)
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
    this.calculateTotal = this.calculateTotal.bind(this);
    this.state = {
      sort: 'date_added',
      total: 0,
    };
  }

  changeSort(sort) {
    this.setState({sort: sort});
  }

  componentDidMount() {
    this.calculateTotal();
  }

  chooseSort() {
    switch (this.state.sort) {
      case 'title':
        return this.props.reading_list.sort(title_compare);
      case 'deliver':
        return this.props.reading_list.sort(deliver_compare);
      case 'pages_compare':
        return this.props.reading_list.sort(pages_compare);
      case 'date_added':
        return this.props.reading_list.sort(date_compare);
      default:
        return this.props.reading_list.sort(title_compare);
    }
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

  calculateTotal() {
    let reading_list = this.props.reading_list;
    let total = 0;
    for (let i =0; i < reading_list.length; i++) {
      if (reading_list[i].to_deliver) {
        total += reading_list[i].article.page_count;
      }
    }
    console.log(total);
    this.setState({
      total: total,
    });
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
        <p className="domain">{getLocation(rlist_item.article.permalink)}</p>
      </td>
      <td className="to-deliver">
        <input type="checkbox" onChange={() => this.props.changeDeliver(rlist_item)} checked={rlist_item.to_deliver}/>
      </td>
      <td className="">{rlist_item.article.page_count}</td>
      <td className="rightmost">{(new Date(rlist_item.date_added)).toDateString().split(' ').slice(1).join(' ')}</td>
    </tr>)
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
              <p>{this.state.total}/50 Pages</p>
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
                      <th className="center-th">To Deliver?</th>
                      <th className="center-th">Number of Pages</th>
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
