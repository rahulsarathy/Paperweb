import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import { Row, Col } from 'react-bootstrap';

export default class Newsletters extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

		};
	}

	render () {
    return (
        <div>
          <h1>Newsletters</h1>
        </div>
    	);
  }
}


ReactDOM.render(<Newsletters/>, document.getElementById('newsletters'))
