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
  Profile,
  Status
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
    this.changeDeliver = this.changeDeliver.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.archiveArticle = this.archiveArticle.bind(this);
    this.handleAddToReadingList = this.handleAddToReadingList.bind(this);
    this.handleInstapaperQueue = this.handleInstapaperQueue.bind(this);
    this.handlePageCount = this.handlePageCount.bind(this);
    this.syncInstapaper = this.syncInstapaper.bind(this);

    this.progressSocket = new WebSocket(
      "ws://" + window.location.host + "/ws/api/progress/"
    );

    // this.pageSocket = new WebSocket(
    //   "ws://" + window.location.host + "/ws/api/page_count/"
    // );

    // this.deliverySocket = new WebSocket(
    //   "ws://" + window.location.host + "/ws/api/deliver/"
    // );

    this.progressSocket.onmessage = function(e) {
      this.handleWebSocket(e);
    }.bind(this);

    // this.pageSocket.onmessage = function(e) {
    //   this.handleWebSocket(e);
    // }.bind(this);

    // this.deliverySocket.onmessage = function(e) {
    //   this.handleWebSocket(e);
    // }.bind(this);

    this.state = {
      reading_list: [],
      show_add: false,
      loading_list: true,
      instapaper: {},
      pocket: {},
      add_to_reading_list: [],
      total: 0,
      completed: 0
    };
  }

  componentDidMount() {
    this.getReadingList();
    this.getServices();
  }

  handleAddToReadingList(data) {
    let link = data.link;
    let percent = data.percent;
    // Add new task if percent is at 0
    if (percent === 0) {
      let add_to_reading_list = this.state.add_to_reading_list;
      let new_task = {
        percent: percent,
        link: link,
        type: "add_to_reading_list"
      };
      add_to_reading_list.push(new_task);
      this.setState({
        add_to_reading_list: add_to_reading_list
      });
      return;
    } else {
      let add_to_reading_list = this.state.add_to_reading_list;
      for (let i = 0; i < add_to_reading_list.length; i++) {
        if (add_to_reading_list[i].link == link) {
          add_to_reading_list[i].percent = percent;
          this.setState({
            add_to_reading_list: add_to_reading_list
          });
          return;
        }
      }
    }
  }

  handlePageCount(data) {
    let link = data.link;
    let page_count = data.page_count;
    let reading_list = this.state.reading_list;

    for (let i = 0; i < reading_list.length; i++) {
      if (reading_list[i].article.permalink === link) {
        reading_list[i].article.page_count = page_count;
      }
    }

    this.setState({
      reading_list: reading_list
    });
  }

  handleToDeliver(data) {
    let to_deliver = data.to_deliver;
    let link = data.link;
    let reading_list = this.state.reading_list;

    for (let i = 0; i < reading_list.length; i++) {
      if (reading_list[i].article.permalink === link) {
        reading_list[i].to_deliver = to_deliver;
      }
    }
    this.setState({
      reading_list: reading_list
    });
  }

  handleInstapaperQueue(data) {
    let total = data.total;
    let completed = data.completed;

    this.setState({
      total: total,
      completed: completed
    });
  }

  handleWebSocket(e) {
    let data = JSON.parse(e.data);
    switch (data.job_type) {
      case "add_to_reading_list":
        this.handleAddToReadingList(data);
        break;
      case "page_count":
        this.handlePageCount(data);
        break;
      case "instapaper_queue":
        this.handleInstapaperQueue(data);
        break;
      case "to_deliver":
        this.handleToDeliver(data);
        break;
      case "reading_list_item":
        this.handleReadingList(data);
        break;
      case "message":
        break;
      default:
    }
  }

  handleReadingList(data) {
    let reading_list_item = data.reading_list_item;
    let reading_list = this.state.reading_list;
    reading_list.unshift(reading_list_item);
    this.setState({
      reading_list: reading_list
    });
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
    this.closeModal();
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
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };

    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      url: "../api/instapaper/sync_instapaper",
      data: data,
      type: "POST",
      success: function(data) {}
    });
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
          <Header />
          <div className="pulp-container">
            <div className="sidebar-container">
              <div className="sidebar">
                <MenuItem to="/reading_list">Unread</MenuItem>
                <MenuItem to="/delivery">Delivery</MenuItem>
                <MenuItem to="/archive">Archive</MenuItem>
              </div>
            </div>
            <div className="page-container">
              <Status
                add_to_reading_list={this.state.add_to_reading_list}
                completed={this.state.completed}
                total={this.state.total}
              />
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
