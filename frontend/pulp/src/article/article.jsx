import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import shortid from "shortid";
import {
  useWindowDimensions,
  MiniMap,
  useMousePosition,
  Progress,
  Summary,
} from "./components.jsx";
// import { Dropdown } from "react-bootstrap";
// import { Header } from "../components/components.jsx";
import { TableOfContents, Header } from "./components.jsx";

import * as Sentry from "@sentry/browser";
if (process.env.NODE_ENV == "production") {
  Sentry.init({
    dsn: "https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
  });
}

document.title = article_json.title;

let coords = [];

// article_json is passed to the dom
export default class Article extends React.Component {
  constructor(props) {
    super(props);
    this.createArticle = this.createArticle.bind(this);

    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.offset != prevProps.offset) {
    //   this.setState({
    //     show_summary: false,
    //   });
    // }
  }

  createMarkup() {
    return { __html: article_json.content };
  }

  // magnifier(hover, yPos = 0) {
  //   this.setState({
  //     hover: hover,
  //     offset: yPos,
  //   });
  // }

  createArticle(margin = 0) {
    let author_text;
    article_json.author === null || article_json.author === ""
      ? (author_text = "")
      : (author_text = "By " + article_json.author);
    let style = {
      margin: margin,
    };
    return (
      <div style={style} className="article">
        <h1>{article_json.title}</h1>
        <p className="author">{author_text}</p>
        <div
          className="content"
          dangerouslySetInnerHTML={this.createMarkup()}
        ></div>
      </div>
    );
  }

  render() {
    let { offset, height, total_height, width } = this.props;

    return (
      <div id="big-wrapper">
        <Header height={height} offset={this.props.offset} />
        <div id="article-wrapper" className="article-wrapper">
          {this.createArticle("auto")}
        </div>
        <Summary
          show_summary={this.state.show_summary}
          a_tag={this.state.a_tag}
          closeSummary={this.closeSummary}
        />
        <Progress
          offset={offset}
          total_height={this.props.total_height}
          height={height}
        />
        <MiniMap
          total_height={total_height}
          height={height}
          offset={offset}
          changeScroll={this.props.changeScroll}
          innerHTML={this.createMarkup()}
          width={width}
          createArticle={this.createArticle}
          show_summary={this.state.show_summary}
        ></MiniMap>
        {/*this.state.hover ? (
          <div className="magnifier">
            <div
              className="magnifier-article"
              style={{ marginTop: this.state.offset * -1 }}
            >
              {this.createArticle()}
            </div>
          </div>
        ) : (
          <div></div>
        )*/}
      </div>
    );
  }
}

const ArticleWrapper = () => {
  document.title = article_json.title;

  let { height, width, offset, total } = useWindowDimensions();

  // const { mouseX, mouseY } = useMousePosition();

  // function changeScroll(offset) {
  //   // let percent = offset / height;
  //   // let scaled = percent * total;
  //   // document.documentElement.scrollTop = document.body.scrollTop = offset;
  //   window.scrollTo({ top: offset, behavior: "smooth" });
  //   // var time = 10;
  //   // var distance = offset;

  //   // $("body,html,document")
  //   //   // .stop()
  //   //   .animate(
  //   //     {
  //   //       scrollTop: distance * 1,
  //   //     },
  //   //     time
  //   //   );
  // }

  function changeScroll(offset, animate = false) {
    // if (animate) {
    //   console.log("change scroll fired with animation: " + animate);

    //   $("html, body").animate({ scrollTop: offset }, "50");
    // } else {
    //   console.log("change scroll fired with animation: " + animate);

    //   document.documentElement.scrollTop = document.body.scrollTop = offset;
    // }

    document.documentElement.scrollTop = document.body.scrollTop = offset;
  }

  offset = offset;

  return (
    <Article
      width={width}
      height={height}
      offset={offset}
      total_height={total}
      changeScroll={changeScroll}
    />
  );
};

ReactDOM.render(<ArticleWrapper />, document.getElementById("article"));
