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
    this.handleMove = this.handleMove.bind(this);

    this.handleHover = this.handleHover.bind(this);
    this.handleLeave = this.handleLeave.bind(this);

    this.state = {
      hover: false,
      a_tag: {},
      show_summary:
    };
  }

  createMarkup() {
    return { __html: article_json.content };
  }

  componentDidMount() {
    // this.getSummary();
    this.findLinks();
  }

  // magnifier(hover, yPos = 0) {
  //   this.setState({
  //     hover: hover,
  //     offset: yPos,
  //   });
  // }

  handleHover(a_tag) {
    this.setState({
      hover: true,
      a_tag: a_tag,
    });
  }

  handleLeave(e) {
    this.setState({
      hover: false,
    });
  }

  findLinks() {
    let a_tags = document
      .getElementById("article-wrapper")
      .getElementsByTagName("a");
    coords = [];
    for (let i = 0; i < a_tags.length; i++) {
      // a_tags[i].onmouseover = this.handleHover;

      a_tags[i].onmouseover = function() {
        this.handleHover(a_tags[i]);
      }.bind(this);

      a_tags[i].onmouseleave = this.handleLeave;
      a_tags[i].id = "link" + i;
      // console.log(a_tags[i].text);
      // console.log(a_tags[i].getBoundingClientRect());
      let rect = a_tags[i].getBoundingClientRect();
      // console.log(rect);
      coords.push({
        left: parseInt(rect.x) + window.scrollX,
        width: parseInt(rect.width),
        height: parseInt(rect.height),
        // top: parseInt(rect.y) + window.pageYOffset,
        top: a_tags[i].offsetTop,
        bottom: rect.bottom + window.pageYOffset,
        text: a_tags[i].text,
      });
    }

    return coords;
  }

  handleMove(e) {
    // let offset = this.props.offset;
    // console.log(e.clientX + ", " + final_y);=
    // console.log(e);
    // if (this.checkForLink(e)) {
    //   console.log("hover");
    // }
    // this.checkForLink(e);
    // e.persist();
  }

  checkForLink(e) {
    for (let i = 0; i < coords.length; i++) {
      // console.log("checking ", coords[i].text);

      if (this.checkRectangle(coords[i], e)) {
        console.log("hover on ", coords[i].text);
        return true;
      }
    }
    // console.log(coords[0].top);
    // let result = this.checkRectangle(coords[1], e);
    // console.log(result);
    // return result;
    return false;
  }

  checkRectangle(coords, e) {
    // coords = this.findLinks();
    this.findLinks();
    // console.log(coords);
    let top_left = coords.left;
    // console.log("left is " + top_left);
    // console.log("x coord is", e.clientX);
    let top_right = coords.left + coords.width;
    // console.log("right is " + top_right);
    // console.log(
    //   "in between x is ",
    //   e.clientX >= top_left && e.clientX <= top_right
    // );
    let offset = this.props.offset;
    let height = this.props.height;
    let total_height = this.props.total_height;
    let topY = coords.top;
    let bottomY = coords.top + coords.height;
    let final_y = e.clientY + offset;

    // console.log("top is ", topY);
    // console.log("coords top is ", coords.top);
    // console.log("clientY is ", e.clientY);
    // console.log("offset is ", offset);
    // console.log("bottom is ", bottomY);
    let scrollTop = window.pageYOffset;

    // console.log(e);
    // console.log("top Y is ", topY);
    // console.log("bottom Y is ", bottomY);
    // console.log("pageY is ", e.pageY);
    // let adjusted_y = e.target.offsetTop;
    // console.log("adjusted y is ", adjusted_y);
    // console.log("clientY is ", e.clientY);
    // console.log("scrollY is", window.scrollY);
    // console.log("offset is ", offset);
    // console.log("height is ", height);
    // console.log("total_height is ", total_height);
    // console.log("scrollTop is ", scrollTop);
    // console.log("actual pos is ", e.pageY - e.clientY);
    // console.log(window.scrollY + (height - e.clientY));

    // e.persist();
    // console.log(e.target);
    // console.log(e.pageEvent);

    if (
      e.pageX >= top_left &&
      e.pageX <= top_right &&
      e.pageY >= topY &&
      e.pageY <= bottomY
    ) {
      return true;
    }
    return false;
  }

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
          onMouseMove={this.handleMove}
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
