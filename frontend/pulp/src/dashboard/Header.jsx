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
                <button onClick={this.props.handleClick}>My Magazine</button>
                <p><a href="../feed">My Feed</a></p>
                <p><a href="../profile">My Account</a></p>
								<p><a href="../reading_list">Reading List</a></p>
            </div>
    	</div>
    	);
  }
}
