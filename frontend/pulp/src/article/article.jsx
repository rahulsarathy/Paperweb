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
} from "./components.jsx";
// import { Dropdown } from "react-bootstrap";
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
    this.createArticle = this.createArticle.bind(this);
    // this.magnifier = this.magnifier.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.changeScroll = this.changeScroll.bind(this);

    this.handleMove = this.handleMove.bind(this);

    this.state = {
      hover: false,
      offset: 0,

      down: false,
      y: 0,
    };
  }

  handleMouseDown(e) {
    console.log("setting mouse down on " + e.target.id);

    if (e.target.id == "minimap") {
      this.setState({
        down: true,
      });
    }
  }

  handleMouseUp(e) {
    this.setState({
      down: false,
    });
  }

  changeScroll(e) {
    // console.log("wrapper change scroll called");
    let scaledPos = this.scaleYPosForArticle(e.clientY);
    this.props.changeScroll(scaledPos, true);
  }

  scaleYPosForArticle(yPos) {
    let scale = 30 / 500;

    let { height, total_height } = this.props;

    let minimap_height = scale * total_height;

    let progress = (yPos + minimap_scroll) / minimap_height;

    let offset = progress * total_height - height / 2;
    return offset;
  }

  handleMove(e) {
    if (this.state.down) {
      console.log("calling change scroll");
      this.changeScroll(e);
    }
    // else {
    //   this.magnifier(true, e.clientY);
    // }

    this.setState({
      y: e.clientY,
    });
  }

  createMarkup() {
    return { __html: article_json.content };
  }

  componentDidMount() {}

  magnifier(hover, yPos = 0) {
    this.setState({
      hover: hover,
      offset: yPos,
    });
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
          className="content"
          dangerouslySetInnerHTML={this.createMarkup()}
        ></div>
      </div>
    );
  }

  render() {
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMove}
      >
        <div id="article-wrapper" className="article-wrapper">
          {this.createArticle("auto")}
        </div>
        <Progress
          offset={this.props.offset}
          total_height={this.props.total_height}
          height={this.props.height}
        />
        <MiniMap
          total_height={this.props.total_height}
          height={this.props.height}
          offset={this.props.offset}
          changeScroll={this.props.changeScroll}
          innerHTML={this.createMarkup()}
          width={this.props.width}
          createArticle={this.createArticle}
          down={this.state.down}
          y={this.state.y}
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

  const { height, width, offset, total } = useWindowDimensions();

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

  return (
    <Article
      width={width}
      height={height}
      offset={pageYOffset}
      total_height={total}
      changeScroll={changeScroll}
    />
  );
};

ReactDOM.render(<ArticleWrapper />, document.getElementById("article"));
