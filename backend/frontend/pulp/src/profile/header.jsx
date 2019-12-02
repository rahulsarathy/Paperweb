import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import shortid from 'shortid';

export default class Header extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

		};
	}

	render () {
    return (
    	<div className="header">
            <div className="links">
                <p><a href="../reading_list">Reading List</a></p>
                <p><a href="../accounts/logout">Logout</a></p>
            </div>
    	</div>
    	);
  }
}
