import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {ReadingListItem} from './components.jsx';

export default class Archive extends React.Component {

  constructor(props) {
    super(props);
    this.getArchive = this.getArchive.bind(this);

    this.state = {
      archive_list: [],
    };
  }

  componentDidMount() {
    this.getArchive();
  }

  getArchive() {
    $.ajax({
      url: '../api/reading_list/get_archive',
      success: function(data) {
        this.setState({
          archive_list: data,
        });
      }.bind(this)
    });
  }

  render() {
    return (<div>
      <h1>Archive</h1>
        <div className="reading-list-items">
          {this.state.archive_list.map((archive_list_item, index) => <ReadingListItem key={index} added={archive_list_item.date_added} archiveArticle={this.archiveArticle} removeArticle={this.removeArticle} article={archive_list_item.article}/>)}
        </div>
    </div>);
  }

}
