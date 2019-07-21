import React from 'react';
import $ from 'jquery';


export default class BlogChapter extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

	render () {
    return (
        <div className="blog-chapter">
            <p className="blog-name">{this.props.blog}</p>
            <p className="blog-title">{this.props.title}</p>
        </div>
    	);
  }
}