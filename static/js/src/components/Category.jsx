import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BlogCard, AboutCard} from './Components.jsx'
import shortid from 'shortid';


export default class Category extends React.Component {

	constructor(props) {
		super(props);
		
        this.handleClick = this.handleClick.bind(this);

		this.state = {
		};
	} 

    componentDidMount() {

      
    }

    handleClick(e) {
        console.log(event);
    }

	render () {
        var curr_blog = this.props.blogs[0]
       
    return (
        <div className="category-wrapper">
            <div className="category">
                <p className="category-title">{this.props.category}</p>
                {
                    this.props.blogs.map((blog) =>
                        <BlogCard key={shortid.generate()} blog={blog} onClick={this.handleClick}/>
                        )
                }        
            </div>
            <AboutCard blog={curr_blog}/>
        </div>
    	);
  }
}