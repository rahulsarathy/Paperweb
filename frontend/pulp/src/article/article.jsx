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

import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

import * as Sentry from "@sentry/browser";
if (process.env.NODE_ENV == "production") {
  Sentry.init({
    dsn: "https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
  });
}

let coords = [];

export default class Article extends React.Component {
  constructor(props) {
    super(props);
    this.createArticle = this.createArticle.bind(this);

    this.handleMove = this.handleMove.bind(this);

    this.state = {
      show_hover: false,
      article_json: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.offset != prevProps.offset) {
    //   this.setState({
    //     show_summary: false,
    //   });
    // }
  }

  componentDidMount() {
    this.getArticle();
  }

  getArticle() {
    axios
      .get(`../api/get_article/`, {
        params: {
          article_id: article_id,
        },
      })
      .then((res) => {
        let data = res.data;
        // console.log(data);
        this.setState({
          article_json: data,
        });
      });
  }

  createMarkup() {
    return { __html: this.state.article_json.content };
  }

  // handleMove(e) {
  //   // console.log(e);
  //   if (e.target.id === "hover-viewport") {
  //     console.log("hover viewport");
  //     console.log(e);

  //     this.setState({
  //       yPos: e.clientY,
  //       show_hover: true,
  //     });
  //   }

  //   if (e.target.id === "no-hover") {
  //     console.log("no-hover hover");
  //     console.log(e);
  //     this.setState({
  //       show_hover: false,
  //     });
  //   }

  //   if (e.target.id === "minimap") {
  //     console.log("minimap hover");
  //     console.log(e);

  //     this.setState({
  //       yPos: e.clientY,
  //       show_hover: true,
  //     });
  //   } else {
  //     console.log("show hover false");
  //     console.log(e);
  //     this.setState({
  //       show_hover: false,
  //     });
  //   }
  //   e.persist();
  // }

  // magnifier(hover, yPos = 0) {
  //   this.setState({
  //     hover: hover,
  //     offset: yPos,
  //   });
  // }

  handleMove(e) {
    // console.log(e);
    if (e.target.id === "minimap") {
      this.setState({
        show_hover: true,
      });
    }
    if (e.target.id === "article-wrapper") {
      this.setState({
        show_hover: false,
      });
    }
    // e.persist();
  }

  createArticle(margin = 0) {
    let author_text;
    let article_json = this.state.article_json;
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

    let { yPos } = this.state;
    return (
      <div id="big-wrapper" onMouseMove={this.handleMove}>
        <Header height={height} offset={this.props.offset} />
        <div id="article-wrapper" className="article-wrapper">
          {this.createArticle("auto")}
        </div>
        {/*<Summary
          show_summary={this.state.show_summary}
          a_tag={this.state.a_tag}
          closeSummary={this.closeSummary}
        />*/}
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
          yPos={yPos}
          createArticle={this.createArticle}
          show_summary={this.state.show_summary}
          show_hover={this.state.show_hover}
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
