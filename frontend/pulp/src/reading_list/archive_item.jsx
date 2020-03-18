import React from "react";
import ReactDOM from "react-dom";

export default class ArchiveItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleHover = this.handleHover.bind(this);
    this.handleUnhover = this.handleUnhover.bind(this);

    this.state = {};
  }

  getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
  }

  handleHover() {
    this.setState({ hovered: true });
  }

  handleUnhover() {
    this.setState({ hovered: false });
  }

  render() {
    const { article, added, index } = this.props;
    let mercury_response = article.mercury_response;
    let host = this.getLocation(article.permalink);
    let href = "../articles/?url=" + encodeURIComponent(article.permalink);

    return (
      <div className="archivelist-item-container">
        <div
          className="archive-list-item"
          onMouseEnter={this.handleHover}
          onMouseLeave={this.handleUnhover}
        >
          <div className="title">
            <p>
              <a target="_blank" href={href}>
                {article.title}
              </a>
            </p>
          </div>
          <div className="author">
            {mercury_response.author ? (
              <p className="author_text">{"by " + mercury_response.author}</p>
            ) : (
              ""
            )}
          </div>
          <div className="extras">
            <div className="domain">
              <a target="_blank" href={article.permalink}>
                {host}
              </a>
            </div>
            <div className="date">
              <p className="date-added">Added on {added.split("T")[0]}</p>
            </div>
          </div>
          {this.state.hovered ? (
            <div className="hover-section">
              <button
                onClick={() => this.props.removeArticle(article.permalink)}
              >
                Delete
              </button>
              <button
                onClick={() => this.props.unArchiveArticle(article.permalink)}
              >
                Unarchive
              </button>
            </div>
          ) : (
            <div className="hover-section"></div>
          )}
        </div>
      </div>
    );
  }
}
