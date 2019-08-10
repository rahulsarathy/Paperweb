import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

import {BlogCard} from './components/Components.jsx'


export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

    componentDidMount() {
    	this.getBlogs();
    }

    getBlogs() {
    	$.ajax(
    		{
    			url: '/api/blogs',
    			type: 'GET',
    			success: function(data)
    			{
    				this.setState(
    					{
    						blogs: data
    					});
    			}.bind(this)

    		});
    }

    createBlogCards() {
    	if (!this.state.blogs){
    		return;
    	}
    	var blog_cards = [];
    	this.state.blogs.forEach( blog => {
    		console.log(blog);

    		var name = blog.name;
    		var about = blog.about;
    		var about_link = blog.about_link;
    		var authors = blog.authors;
    		var image = blog.image;

    		var blog_card = <BlogCard name={name} key={name} about={about} about_link={about_link} authors={authors} image={image}/>
    		blog_cards.push(blog_card);
    	}); 
    	return blog_cards;
    }

	render () {
		var blog_cards = this.createBlogCards();

    return (
    	<div>
    	{blog_cards}
    	</div>
    	);
  }
}

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'))

