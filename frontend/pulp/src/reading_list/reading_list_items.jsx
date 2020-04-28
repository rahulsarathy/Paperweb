import React from "react";
import PropTypes from "prop-types";
import { ReadingListItem, Pages } from "./components.jsx";

const num_of_items = 10;

class ReadingListItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let reading_list = this.props.reading_list;
    return (
      <div className="reading-list-items">
        {reading_list.map((reading_list_item) => (
          <ReadingListItem
            key={reading_list_item.article.permalink}
            added={reading_list_item.date_added}
            archiveArticle={this.props.archiveArticle}
            removeArticle={this.props.removeArticle}
            article={reading_list_item.article}
            image_url={reading_list.image_url}
            to_deliver={reading_list.to_deliver}
            article_id={reading_list_item.article.custom_id}
          />
        ))}
      </div>
    );
  }
}

export default ReadingListItems;
