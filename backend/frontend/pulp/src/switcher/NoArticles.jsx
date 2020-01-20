import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {ReadingListItem} from './components.jsx';
import {Modal, Button} from 'react-bootstrap';

export default class NoArticles extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <p className="no-articles">No articles currently saved</p>
      </div>
    );
  }

}
