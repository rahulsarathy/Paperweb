import React from "react";
import ReactDOM from "react-dom";
import shortid from "shortid";

import {} from "./components.jsx";

import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

import * as Sentry from "@sentry/browser";
if (process.env.NODE_ENV == "production") {
  Sentry.init({
    dsn: "https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
  });
}

export default class Blogs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  getBlogs() {
    axios.get(`../api/blogs/get_blogs/`).then((res) => {
      let data = res.data;
      console.log(data);
    });
  }

  render() {
    return <div className="blogs">hello</div>;
  }
}
