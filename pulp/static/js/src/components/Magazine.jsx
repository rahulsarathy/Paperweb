import React from 'react';
import $ from 'jquery';
import {BlogChapter} from './Components.jsx'

var BlogChapters = [
{
    "blog": "Econlib",
    "title": "Historically Hollow: The Cries of Populism",
    "color": "#0E1534"
},
{
    "blog": "Ribbonfarm",
    "title": "Pleasure as an Organizing Principle",
    "color": "#7ECDFC"
},
{
    "blog": "Chaos Monkeys",
    "title": "Slouching toward Bethlehem to be born",
    "color": "#E62D29"
},
{
    "blog": "Kortina",
    "title": "Speech is Free, Distribution is Not // A Tax on the Purchase of Human Attention and Political Power",
    "color": "#438BCA"
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
            <BlogChapter key={blog_chapter.blog} color={blog_chapter.color} blog={blog_chapter.blog} title={blog_chapter.title}/>
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