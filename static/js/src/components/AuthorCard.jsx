import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import {BlogCard, Authors} from './Components.jsx'



export default class AuthorCard extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
		};
	}

    componentDidMount() {
        // console.log(this.props.author);
    }

	render () {

    return (
        <div className="authorcard">
            <h2>{this.props.author.name}</h2>
            <div className="author-image">
                <img className="author-profile" src={this.props.author.profile} />
            </div>
            <div className="author-title">
                <p>{this.props.author.bio}</p>
            </div>
        </div>
    	);
  }
}