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
  Status,
  Subscribe
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

    //delivery
    this.changeDeliver = this.changeDeliver.bind(this);

    //reading list
    this.addArticle = this.addArticle.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.archiveArticle = this.archiveArticle.bind(this);

    // loading bars
    this.handleInstapaperQueue = this.handleInstapaperQueue.bind(this);
    this.handlePageCount = this.handlePageCount.bind(this);
    this.handlePocketQueue = this.handlePocketQueue.bind(this);
    this.handleAddToReadingList = this.handleAddToReadingList.bind(this);

    // reading list integrations
    this.syncPocket = this.syncPocket.bind(this);
    this.syncInstapaper = this.syncInstapaper.bind(this);
    this.removePocket = this.removePocket.bind(this);
    this.removeInstapaper = this.removeInstapaper.bind(this);

    // Payments
    this.checkPaymentStatus = this.checkPaymentStatus.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    this.startWebsocket();

    this.state = {
      reading_list: [],
      show_add: false,
      loading_list: true,
      instapaper: {},
      pocket: {},
      add_to_reading_list: [],
      instapaper_total: 0,
      instapaper_completed: 0,
      pocket_total: 0,
      pocket_completed: 0,
      paid: true
    };
  }

  componentDidMount() {
    this.getReadingList();
    this.getServices();
    this.checkPaymentStatus();
  }

  startWebsocket() {
    //websocket
    let ws_url = "";
    if (process.env.NODE_ENV == "production") {
      ws_url = "wss://" + window.location.host + "/ws/api/progress/";
    } else {
      ws_url = "ws://" + window.location.host + "/ws/api/progress/";
    }
    this.progressSocket = new WebSocket(ws_url);
    this.progressSocket.onmessage = function(e) {
      this.handleWebSocket(e);
    }.bind(this);

    console.log("connected websocket");

    this.progressSocket.onclose = function() {
      console.log("closing and restarting websocket");
      // connection closed, discard old websocket and create a new one in 5s
      this.progressSocket = null;
      setTimeout(this.startWebsocket, 5000);
    };
  }

  checkPaymentStatus() {
    $.ajax({
      url: "../api/payments/payment_status",
      type: "GET",
      success: function(data, statusText, xhr) {
        if (xhr.status == 208) {
          this.setState({ paid: true });
        } else {
          this.setState({ paid: false });
        }
      }.bind(this)
    });
  }

  unsubscribe() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      type: "POST",
      data: data,
      url: "../api/payments/cancel_payment/",
      success: function(data) {
        this.setState({
          paid: false
        });
      }.bind(this)
    });
  }

  handleAddToReadingList(data) {
    let link = data.link;
    let percent = data.percent;
    let add_to_reading_list = this.state.add_to_reading_list;

    // remove task if it is 100 percent complete
    if (percent === 100) {
      let i;
      for (i = 0; i < add_to_reading_list.length; i++) {
        if (add_to_reading_list[i].link === link) {
          let index = i;
          break;
        }
      }
      add_to_reading_list.splice(i, 1);
      this.setState({
        add_to_reading_list: add_to_reading_list
      });
      return;
    }
    // Add new task if percent is at 0
    if (percent === 0) {
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
      instapaper_total: total,
      instapaper_completed: completed
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
      case "pocket_queue":
        this.handlePocketQueue(data);
        break;
      case "to_deliver":
        this.handleToDeliver(data);
        break;
      case "reading_list":
        this.handleReadingList(data);
        break;
      case "message":
        break;
      default:
    }
  }

  handlePocketQueue(data) {
    let total = data.total;
    let completed = data.completed;

    this.setState({
      pocket_total: total,
      pocket_completed: completed
    });
  }

  handleReadingList(data) {
    let reading_list = data.reading_list;
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

  syncInstapaper() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };

    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let instapaper = this.state.instapaper;
    $.ajax({
      url: "../api/instapaper/sync_instapaper",
      data: data,
      type: "POST",
      success: function(data) {
        instapaper.last_polled = data;
        this.setState({
          instapaper: instapaper
        });
      }.bind(this),
      error: function(xhr) {
        instapaper.invalid = true;
        this.setState({
          instapaper: instapaper
        });
      }.bind(this)
    });
  }

  syncPocket() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };

    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let pocket = this.state.pocket;

    $.ajax({
      url: "../api/pocket/sync_pocket",
      data: data,
      type: "POST",
      success: function(data) {
        pocket.last_polled = data;
        this.setState({
          pocket: pocket
        });
      }.bind(this),
      error: function(xhr) {
        pocket.invalid = true;
        this.setState({
          pocket: pocket
        });
      }.bind(this)
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

  closeModal() {
    this.setState({
      show_add: false
    });
  }

  // Calculate how many pages are set for delivery
  calculateTotal() {
    let page_total = 0;
    let total_articles = 0;
    let reading_list = this.state.reading_list;
    for (let i = 0; i < reading_list.length; i++) {
      if (reading_list[i].to_deliver) {
        page_total += reading_list[i].article.page_count;
        total_articles += 1;
      }
    }
    return page_total;
  }

  // Calculate how many articles are set for delivery
  calculateTotalArticles() {
    let total_articles = 0;
    let reading_list = this.state.reading_list;
    for (let i = 0; i < reading_list.length; i++) {
      if (reading_list[i].to_deliver) {
        total_articles += 1;
      }
    }
    return total_articles;
  }

  removeInstapaper(e) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      type: "POST",
      data: data,
      url: "../api/instapaper/remove_instapaper",
      success: function(data) {
        let instapaper = this.state.instapaper;
        instapaper.signed_in = false;
        this.setState({
          instapaper: instapaper
        });
      }.bind(this)
    });
  }

  removePocket(e) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };
    $.ajax({
      type: "POST",
      data: data,
      url: "../api/pocket/remove_pocket",
      success: function(data) {
        let pocket = this.state.pocket;
        pocket.signed_in = false;
        this.setState({
          pocket: pocket
        });
      }.bind(this)
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
                {!this.state.paid ? (
                  <MenuItem to="/payments">Subscribe</MenuItem>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className="page-container">
              <Status
                add_to_reading_list={this.state.add_to_reading_list}
                instapaper_completed={this.state.instapaper_completed}
                instapaper_total={this.state.instapaper_total}
                pocket_completed={this.state.pocket_completed}
                pocket_total={this.state.pocket_total}
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
                      instapaper={this.state.instapaper}
                      syncPocket={this.syncPocket}
                      removePocket={this.removePocket}
                      removeInstapaper={this.removeInstapaper}
                      syncInstapaper={this.syncInstapaper}
                      paid={this.state.paid}
                      unsubscribe={this.unsubscribe}
                    />
                  )}
                />
                <Route path="/payments" render={() => <Subscribe />} />
                <Route
                  path="/delivery"
                  render={() => (
                    <Delivery
                      page_total={this.calculateTotal()}
                      total_articles={this.calculateTotalArticles()}
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
