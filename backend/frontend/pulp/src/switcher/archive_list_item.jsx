import React from 'react';
import ReactDOM from 'react-dom';

export default class ArchiveListItem extends React.Component {

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
    this.setState({hovered: true});
  }

  handleUnhover() {
    this.setState({hovered: false});
  }

  render() {
    const {article, added, index} = this.props;
    let mercury_response = article.mercury_response;
    let host = this.getLocation(article.permalink)
    let href = '../articles/?url=' + encodeURIComponent(article.permalink)
    let has_image = false;
    let style = {}
    mercury_response.lead_image_url
      ? has_image = true
      : has_image = false
    if (!has_image) {
      style = {
        width: '100%'
      }
    }
    return (<div className="readinglist-item-container" style={style}>
      <div className="archive-list-item" onMouseEnter={this.handleHover} onMouseLeave={this.handleUnhover}>
        <h3>
          <a target="_blank" href={href}>{article.title}</a>
        </h3>
        <div className="extras">
          <div className="domain">
            <a target="_blank" href={article.permalink}>{host}</a>
          </div>
          <div className="author">
            {
              mercury_response.author
                ? <p className="author_text">{'by ' + mercury_response.author}</p>
                : ''
            }
          </div>
        </div>
        {
          this.state.hovered
            ? (<div className="hover-section">
              <button onClick={() => this.props.removeArticle(article.permalink)}>Remove</button>
              <button onClick={() => this.props.archiveArticle(article.permalink)}>Archive</button>
            </div>)
            : <div className="hover-section">
                <p className="date-added">Added on {added.split('T')[0]}</p>
              </div>
        }
      </div>
    </div>);
  }
}
