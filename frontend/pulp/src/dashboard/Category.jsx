import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BlogCard, AboutCard} from './Components.jsx'
import shortid from 'shortid';
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default class Category extends React.Component {

	constructor(props) {
		super(props);
        this.showCard = this.showCard.bind(this);
	} 

    componentDidMount() {

    }

    showCard(blog) {
        this.props.show(blog);
    }

	render () {
        return (
            <div className="category">
            <h3>{this.props.category}</h3>
            <div className="blogcards">
            {
                this.props.blogs.map((blog) => 
                    <BlogCard show={this.showCard} key={shortid.generate()} blog={blog}/>
                    )
            }
            </div>
            {Object.keys(this.props.selected).length === 0 ? <div></div> : <AboutCard close={this.props.hide} blog={this.props.selected}/>}
            </div>
            );
    }
}