import React from 'react';
import $ from 'jquery';
import {BlogChapter} from './Components.jsx'

var BlogChapters = [
{
    "blog": "Econlib",
    "title": "Historically Hollow: The Cries of Populism"
},
{
    "blog": "Ribbonfarm",
    "title": "Pleasure as an Organizing Principle" 
},
{
    "blog": "Chaos Monkeys",
    "title": "Slouching toward Bethlehem to be born" 
},
{
    "blog": "Kortina",
    "title": "Speech is Free, Distribution is Not // A Tax on the Purchase of Human Attention and Political Power"
}

];

export default class Magazine extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

    createBlogChapters() {

        var to_return = [];

        to_return = BlogChapters.map((blog_chapter) => 
            <BlogChapter key={blog_chapter.blog} blog={blog_chapter.blog} title={blog_chapter.title}/>
            );

        return to_return;
    }

	render () {

        var finalChapters = this.createBlogChapters();

    return (
        <div>
    	<div className="magazine">
            <div className="binding"></div>
            <div className="content">
                <h1 className="magazine-title">PULP</h1> 
                <p className="subtitle">July 1st to July 31st</p>
                <p className="subtitle">Harry Daly</p>
                {finalChapters}
            </div>
    	</div>
        <div className="page"></div>
        <div className="page2"></div>
        </div>
    	);
  }
}