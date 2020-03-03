import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import shortid from "shortid";
import "bootstrap/dist/css/bootstrap.css";
import { NoArticles, DeliveryTable } from "./components.jsx";

export default class Delivery extends React.Component {
  constructor(props) {
    super(props);
    this.getReadingList.bind(this);

    this.state = {
      reading_list: []
    };
  }

  componentDidMount() {
    this.getReadingList();
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
        console.log(data);
        this.setState({
          reading_list: data
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div className="delivery">
        <h1>Delivery Management</h1>
        <hr></hr>
        <NoArticles length={this.state.reading_list.length} />
        <DeliveryTable reading_list={this.state.reading_list} />
      </div>
    );
  }
}

// ReactDOM.render(<Delivery/>, document.getElementById('reading_list'))
