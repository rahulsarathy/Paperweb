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
  Delivery,
  Sidebar,
  AddArticle,
  Profile
} from "./components.jsx";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useHistory,
  withRouter
} from "react-router-dom";

function MenuItem(props) {
  return (
    <NavLink
      to={props.to}
      className="menu-item"
      activeClassName="menu-item-selected"
    >
      {props.children}
    </NavLink>
  );
}

export default class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
    this.changeDeliver = this.changeDeliver.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.archiveArticle = this.archiveArticle.bind(this);

    this.state = {
      value: "",
      reading_list: [],
      error_name: "",
      selected: "unread",
      show_add: false,
      loading_list: true,
      instapaper: {},
      pocket: {},
      syncing_instapaper: false,
      syncing_pocket: false
    };
  }

  componentDidMount() {
    this.getReadingList();
    this.getServices();
  }

  getReadingList() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/get_reading",
      data: data,
      type: "GET",
      success: function(data) {
        this.setState({
          reading_list: data,
          loading_list: false
        });
      }.bind(this)
    });
  }

  removeArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/remove_reading",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  archiveArticle(link) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    };

    $.ajax({
      url: "../api/reading_list/archive_item",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  addArticle(link) {
    if (link === "") {
      this.setState({
        error_name: "empty"
      });
    }
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      link: link,
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/add_reading",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data,
          show_add: false
        });
      }.bind(this),
      error: function(xhr) {
        console.log(xhr);
        if (xhr.responseText == "Invalid URL") {
          this.setState({
            error_name: "invalid_url",
            show_add: false
          });
        }
      }.bind(this)
    });
  }

  changeSelected(value) {
    this.setState({ selected: value });
  }

  changeDeliver(to_deliver, permalink) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      to_deliver: !to_deliver,
      permalink: permalink,
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      url: "../api/reading_list/update_deliver",
      data: data,
      type: "POST",
      success: function(data) {
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  showModal() {
    this.setState({
      show_add: true
    });
  }

  getServices() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();

    $.ajax({
      url: "../api/users/get_services",
      type: "GET",
      success: function(data) {
        this.setState({
          pocket: data.pocket,
          instapaper: data.instapaper
        });
      }.bind(this)
    });
  }

  syncInstapaper() {
    this.setState(
      {
        loading_instapaper: true
      },
      () => {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        $.ajax({
          url: "../api/reading_list/sync_instapaper",
          type: "POST",
          success: function(data) {
            this.setState({
              loading_instapaper: false
            });
          }
        });
      }
    );
  }

  syncPocket() {}

  closeModal() {
    this.setState({
      show_add: false
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Header changeSelected={this.changeSelected} />
          <div className="pulp-container">
            <div className="sidebar-container">
              <div className="sidebar">
                <MenuItem to="/reading_list">Unread</MenuItem>
                <MenuItem to="/delivery">Delivery</MenuItem>
                <MenuItem to="/archive">Archive</MenuItem>
              </div>
            </div>
            <div className="page-container">
              <AddArticle
                addArticle={this.addArticle}
                show_add={this.state.show_add}
                showModal={this.showModal}
                closeModal={this.closeModal}
                empty={this.state.reading_list.length === 0}
              />
              <Switch>
                <Route
                  path="/reading_list"
                  render={() => (
                    <ReadingListView
                      reading_list={this.state.reading_list}
                      removeArticle={this.removeArticle}
                      archiveArticle={this.archiveArticle}
                      showModal={this.showModal}
                      pocket={this.state.pocket}
                      instapaper={this.state.instapaper}
                      loading_list={this.state.loading_list}
                      empty={this.state.reading_list.length === 0}
                    />
                  )}
                />
                <Route path="/archive" component={Archive} />
                <Route
                  path="/profile"
                  render={() => (
                    <Profile
                      pocket={this.state.pocket}
                      syncInstapaper={this.syncInstapaper}
                      instapaper={this.state.instapaper}
                    />
                  )}
                />
                <Route
                  path="/delivery"
                  render={() => (
                    <Delivery
                      pocket={this.state.pocket}
                      instapaper={this.state.instapaper}
                      loading_list={this.state.loading_list}
                      showModal={this.showModal}
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
