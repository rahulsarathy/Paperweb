import React from "react";
import ReactDOM from "react-dom";
import {
  Author,
  FadedContent,
  Extras,
  ReadingListTitle,
  HoverSection,
  ReadingListImage
} from "./components.jsx";

export default class ReadingListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleHover = this.handleHover.bind(this);
    this.handleUnhover = this.handleUnhover.bind(this);

    this.state = {
      hovered: false
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.to_deliver === nextProps.to_deliver) {
  //     return false;
  //   }
  // }

  handleHover() {
    this.setState({ hovered: true });
  }

  handleUnhover() {
    this.setState({ hovered: false });
  }

  render() {
    const { article, added, index, author } = this.props;
    return (
      <div
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleUnhover}
        className="readinglist-item-container"
      >
        <HoverSection
          hovered={this.state.hovered}
          permalink={article.permalink}
          removeArticle={this.props.removeArticle}
          archiveArticle={this.props.archiveArticle}
        />
        <div className="readinglist-item">
          <ReadingListTitle
            permalink={article.permalink}
            title={article.title}
          />
          <Extras author={article.author} permalink={article.permalink} />
          <FadedContent parsed_text={article.preview_text} />
          <ReadingListImage src={article.image_url} />
        </div>
      </div>
    );
  }
}
