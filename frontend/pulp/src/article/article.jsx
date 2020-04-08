import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import shortid from "shortid";
import { useWindowDimensions, MiniMap } from "./components.jsx";
import { Dropdown } from "react-bootstrap";
import { Header } from "../components/components.jsx";

import * as Sentry from "@sentry/browser";
if (process.env.NODE_ENV == "production") {
  Sentry.init({
    dsn: "https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
  });
}

// article_json is passed to the dom
export default class Article extends React.Component {
  constructor(props) {
    document.title = article_json.title;
    super(props);

    this.state = {};
  }

  createMarkup() {
    return { __html: article_json.content };
  }

  componentDidMount() {}

  render() {
    let author_text;
    article_json.author === null || article_json.author === ""
      ? (author_text = "")
      : (author_text = "By " + article_json.author);
    return (
      <div>
        <div className="article">
          <h1>{article_json.title}</h1>
          <p className="author">{author_text}</p>
          <div
            className="content"
            dangerouslySetInnerHTML={this.createMarkup()}
          ></div>
          <MiniMap
            total_height={this.props.total_height}
            height={this.props.height}
            offset={this.props.offset}
          />
        </div>
      </div>
    );
  }
}

const ArticleWrapper = () => {
  document.title = article_json.title;

  const { height, width, offset, total } = useWindowDimensions();

  return (
    <Article
      width={width}
      height={height}
      offset={pageYOffset}
      total_height={total}
    />
  );
};

ReactDOM.render(<ArticleWrapper />, document.getElementById("article"));
