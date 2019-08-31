import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BlogCard, AboutCard} from './Components.jsx'
import shortid from 'shortid';


export default class Category extends React.Component {

	constructor(props) {
		super(props);
		
        this.handleClick = this.handleClick.bind(this);
        this.nextBlog = this.nextBlog.bind(this);
        this.previousBlog = this.previousBlog.bind(this);

		this.state = {
            curr_blog: 0
		};
	} 

    componentDidMount() {

      
    }

    nextBlog() {
        const curr_index = this.state.curr_blog
        if (curr_index == this.props.blogs.length - 1)
        {
            this.setState(
                {
                    curr_blog: 0
                });   
        }
        else {
            this.setState({
                curr_blog: curr_index + 1
            })  
        }
    } 

    previousBlog() {
        const curr_index = this.state.curr_blog;

        if (curr_index == 0) {
            this.setState(
                {
                    curr_blog: 1
                });
        }
        else {
            this.setState(prevState => {
                curr_blog: curr_index - 1
            })     
        }
    }

    handleClick(e) {
        console.log(event);
    }

	render () {
    return (
        <div className="category">
            <div className="category-wrapper">
                <p className="category-title">{this.props.category}</p>
                {
                    this.props.blogs.map((blog) =>
                        <BlogCard key={shortid.generate()} blog={blog} onClick={this.handleClick}/>)
                }        
            </div>
            <div className="aboutcard-slider">
                <div className="aboutcard-slider-wrapper" style={{'transform': `translateX(-${this.state.curr_blog*100}%)`}}>
                    {
                    this.props.blogs.map(blog => <AboutCard nextBlog={this.nextBlog} blog={blog} />)
                }
                </div>
            </div>
        </div>
    	);
  }
}