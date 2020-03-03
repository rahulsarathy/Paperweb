import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import shortid from "shortid";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import {
  Header,
  ReadingListView,
  Archive,
  Profile,
  Delivery,
  Sidebar
} from "./components.jsx";
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

const images_url = "../static/images/";
const icon_url = "../static/icons/";

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className;
    let image_url = "/static/icons/" + this.props.value + ".svg";
    this.props.location.pathname.split("/")[1] === this.props.value
      ? (className = "menu-item-selected")
      : (className = "menu-item");

    return (
      <div className={className} onClick={this.props.onClick}>
        {/*
        this.props.value === 'reading_list'
          ? (<div className="unread">
            <div className="number">{this.props.unread}</div>
          </div>)
          : (<img className="icon" src={image_url}/>)
      */}
        {this.props.text}
      </div>
    );
  }
}

export default class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
    this.updateReadingList = this.updateReadingList.bind(this);
    this.changeDeliver = this.changeDeliver.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.getEmail = this.getEmail.bind(this);

    this.state = {
      value: "",
      reading_list: [],
      invalid_url: false,
      article_data: {},
      selected: "unread",
      unread: 0
    };
  }

  componentDidMount() {
    this.getEmail();
  }

  getEmail() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      url: "../api/users/get_email",
      type: "GET",
      success: function(data) {
        console.log(data);
      }
    });
  }

  updateReadingList(list) {
    this.setState({ reading_list: list });
  }

  changeSelected(value) {
    this.setState({ selected: value });
  }

  changeDeliver(rlist_item) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      to_deliver: !rlist_item.to_deliver,
      permalink: rlist_item.article.permalink,
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/update_deliver",
      data: data,
      type: "POST",
      success: function(data) {
        this.updateReadingList(data);
      }.bind(this)
    });
  }

  render() {
    const RouterMenuItem = withRouter(MenuItem);

    return (
      <Router>
        <div>
          <div className="header">
            <img className="logo" src={images_url + "pulp_header_logo.svg"} />
            <div className="profile-circle"></div>
            <img className="chevron" src={icon_url + "chevron.svg"} />
          </div>
          <div className="pulp-container">
            <div className="sidebar-container">
              <div className="sidebar">
                <Link to={"/reading_list"}>
                  <RouterMenuItem
                    onClick={() => this.changeSelected("reading_list")}
                    selected={this.state.selected}
                    unread={this.state.unread}
                    value="reading_list"
                    text={"Unread"}
                  />
                </Link>
                <Link to={"/settings"}>
                  <RouterMenuItem
                    onClick={() => this.changeSelected("settings")}
                    selected={this.state.selected}
                    value="settings"
                    text={"Settings"}
                  />
                </Link>
                <Link to={"/delivery"}>
                  <RouterMenuItem
                    onClick={() => this.changeSelected("delivery")}
                    selected={this.state.selected}
                    value="delivery"
                    text={"Delivery"}
                  />
                </Link>
                <Link to={"/archive"}>
                  <RouterMenuItem
                    onClick={() => this.changeSelected("archive")}
                    selected={this.state.selected}
                    value="archive"
                    text={"Archive"}
                  />
                </Link>
              </div>
            </div>
            <div className="page-container">
              <Switch>
                <Route
                  path="/reading_list"
                  component={() => <ReadingListView />}
                />
                <Route path="/archive" component={Archive} />
                <Route path="/settings" component={Profile} />
                <Route
                  path="/delivery"
                  component={() => (
                    <Delivery
                      reading_list={this.state.reading_list}
                      changeDeliver={this.changeDeliver}
                    />
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<Switcher />, document.getElementById("reading_list"));
