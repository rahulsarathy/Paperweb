import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BlogCard, AboutCard} from './Components.jsx'
import shortid from 'shortid';
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default class Category extends React.Component {

	constructor(props) {
		super(props);
		
        this.handleClick = this.handleClick.bind(this);
        this.nextBlog = this.nextBlog.bind(this);
        this.selectBlog = this.selectBlog.bind(this);
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

    selectBlog(e)
    {
        var index = ($(e.target).closest('.blogcard').attr('index'));
        this.setState(
            {
                curr_blog: index
            });
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
    // console.log($('.aboutcard'));
        var index = parseInt(($(e.target).closest('.blogcard').attr('index')));
        this.setState(
            {
                curr_blog: index
            });
        if ($(e.target).closest('.category').find('.aboutcard-slider').is(":hidden")) {
            $(e.target).closest('.category').find('.aboutcard-slider').slideDown()
        }
        // if (!$(e.target).closest('.category').find('.aboutcard-slider').is(":hidden")) {
        //     $(e.target).closest('.category').find('.aboutcard-slider').slideUp()
        // }
        // if (index !== this.state.curr_blog)
        // {
        //     if ($(e.target).closest('.category').find('.aboutcard-slider').is(":hidden"))
        //     {
        //         $(e.target).closest('.category').find('.aboutcard-slider').slideDown()
        //     }
        //     this.setState(
        //     {
        //         curr_blog: index
        //     }); 
        // }
        // else {
        //     $(e.target).closest('.category').find('.aboutcard-slider').slideToggle()
        // }
    }

	render () {
        return (
            <div className="category">
                <p className="category-title">{this.props.category}</p>
                    <div className="category-wrapper">
                    {
                        this.props.blogs.map((blog, index) =>
                            <BlogCard index={index} key={shortid.generate()} selectBlog={this.selectBlog} blog={blog} onClick={this.handleClick}/>)
                    }        
            </div>
            <div className="aboutcard-slider">
                <div className="aboutcard-slider-wrapper">
                    <TransitionGroup>
                        <CSSTransition key={shortid.generate()}
                        timeout={300}
                        classNames="fade">
                        <AboutCard key={shortid.generate()} nextBlog={this.nextBlog} blog={this.props.blogs[this.state.curr_blog]} />
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </div>
        </div>
            );
    }
}