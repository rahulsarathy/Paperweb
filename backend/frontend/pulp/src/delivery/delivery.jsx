import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import shortid from "shortid";
import "bootstrap/dist/css/bootstrap.css";
import { NoArticles, DeliveryTable } from "./components.jsx";

export default class Delivery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="delivery">
        <h1>Delivery Management</h1>
        <hr></hr>
        <NoArticles
          showModal={this.props.showModal}
          empty={this.props.reading_list.length === 0}
          loading_list={this.props.loading_list}
          pocket={this.props.pocket}
          instapaper={this.props.instapaper}
        />
        <DeliveryTable
          empty={this.props.reading_list.length === 0}
          reading_list={this.props.reading_list}
          changeDeliver={this.props.changeDeliver}
        />
      </div>
    );
  }
}

// ReactDOM.render(<Delivery/>, document.getElementById('reading_list'))
