import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Header, ReadingListView, ReadingListItem, Archive, Profile} from './components.jsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams,
  withRouter
} from "react-router-dom";

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className;
    let image_url = '/static/icons/' + this.props.value + '.svg'
    this.props.location.pathname.split('/')[1] === this.props.value
      ? className = 'menu-item-selected'
      : className = "menu-item"

    return (<div className={className} onClick={this.props.onClick}>
      {
        this.props.value === 'reading_list'
          ? (<div className="unread">
            <div className="number">{this.props.unread}</div>
          </div>)
          : (<img className="icon" src={image_url}/>)
      }
      {this.props.text}
    </div>);
  }
}

export default class Switcher extends React.Component {

  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
    this.updateReadingList = this.updateReadingList.bind(this);
    this.state = {
      value: "",
      reading_list: [],
      invalid_url: false,
      article_data: {},
      selected: 'unread',
      unread: 0,
    };
  }

  componentDidMount() {
    this.getReadingList();
  }

  getReadingList() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/reading_list/get_reading',
      data: data,
      type: 'GET',
      success: function(data) {
        this.updateReadingList(data);
      }.bind(this)
    });
  }


  changeSelected(value) {
    this.setState({selected: value});
  }

  updateReadingList(list) {
    this.setState({
      reading_list: list,
    });
  }

  render() {
    const RouterMenuItem = withRouter(MenuItem);

    return (<Router>
      <div>
        <Row className="readinglist-container">
          <Col className="sidebar">
            <Link to={'/reading_list'}>
              <RouterMenuItem onClick={() => this.changeSelected("reading_list")} selected={this.state.selected} unread={this.state.unread} value="reading_list" text={"Unread"}/>
            </Link>
            <Link to={'/archive'}>
              <RouterMenuItem onClick={() => this.changeSelected("archive")} selected={this.state.selected} value="archive" text={"Archive"}/>
            </Link>
            <Link to={'/settings'}>
              <RouterMenuItem onClick={() => this.changeSelected("settings")} selected={this.state.selected} value="settings" text={"Settings"}/>
            </Link>
          </Col>
          <Col className="readinglist">
            <Route path='/reading_list' component={() => <ReadingListView reading_list={this.state.reading_list} updateReadingList={this.updateReadingList}/>}/>
            <Route path='/archive' component={Archive}/>
            <Route path='/settings' component={Profile}/>
          </Col>
        </Row>
      </div>
    </Router>);
  }
}

ReactDOM.render(<Switcher/>, document.getElementById('reading_list'))
