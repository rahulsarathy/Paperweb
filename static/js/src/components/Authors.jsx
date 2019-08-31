import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';

import {BlogCard, AuthorCard} from './Components.jsx'


export default class Authors extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
            curr_author: 0
		};
	}

    componentDidMount() {
    }

	render () {
        return (
            <div>
            {
                this.props.authors.map((author) =>
                    <AuthorCard key={shortid.generate()} author={author} onClick={this.handleClick}/>
                    )
            }  
            </div>
    	);
  }
}