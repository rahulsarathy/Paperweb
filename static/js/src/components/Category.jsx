import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BlogCard} from './Components.jsx'
import shortid from 'shortid';


export default class Category extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
		};
	}

    componentDidMount() {

      
    }

    handleClick() {
    }

	render () {
       
    return (
        <div className="category">
        <p className="category-title">{this.props.category}</p>
        {
            this.props.blogs.map((blog) =>
                <BlogCard key={shortid.generate()} blog={blog} />
                )
        }        
        </div>
    	);
  }
}