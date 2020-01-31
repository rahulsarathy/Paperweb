import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Table, DropdownButton, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {NoArticles} from '../switcher/components.jsx';
import {} from './components.jsx';

export default class Checkbox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (<div className="checkbox">
    <span class="checkmark"></span>
    </div>);
  }
}

// ReactDOM.render(<Delivery/>, document.getElementById('reading_list'))
