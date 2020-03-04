import React from "react";
import PropTypes from "prop-types";
import { ReadingListItem, Pages } from "./components.jsx";

const num_of_items = 10;

class ReadingListItems extends React.Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  nextPage() {
    let end_index = (this.state.page + 2) * num_of_items;
    if (end_index > this.state.reading_list.length) {
      return;
    } else {
      this.setState({
        page: this.state.page + 1
      });
    }
  }

  previousPage() {
    this.setState({
      page: this.state.page - 1
    });
  }

  calculateSlice() {
    let start_index = this.props.page * num_of_items;
    let end_index = (this.props.page + 1) * num_of_items;
    let reading_list = this.props.reading_list.slice(start_index, end_index);
    return reading_list;
  }

  render() {
    let reading_list = this.calculateSlice();
    let showPages = this.props.reading_list.length > num_of_items;
    return (
      <div className="reading-list-items">
        {reading_list.map((reading_list_item, index) => (
          <ReadingListItem
            key={index}
            added={reading_list_item.date_added}
            archiveArticle={this.props.archiveArticle}
            removeArticle={this.props.removeArticle}
            article={reading_list_item.article}
          />
        ))}
        <Pages
          page={this.props.page}
          previousPage={this.previousPage}
          nextPage={this.nextPage}
          length={this.props.reading_list.length}
          showPages={showPages}
        />
      </div>
    );
  }
}

export default ReadingListItems;
