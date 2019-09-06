import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import { CSSTransition, TransitionGroup } from "react-transition-group";

import {Authors} from './Components.jsx'


export default class AboutCard extends React.Component {

	constructor(props) {
		super(props);

        this.subscribe = this.subscribe.bind(this)
		
		this.state = {
            subscribed: false
		};
	}

    componentDidMount() {

    }

    nextAuthor() {
        if  (this.state.author == this.props.blog.authors.length) {
           
        }

        this.setState(
            {
                author: this.state.author + 1
            });
    }

    subscribe () {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        $.ajax(
            {
                url: '/api/blogs/subscribe/',
                type: 'POST',
                data: {
                    name_id: this.props.blog.name_id,
                    csrfmiddlewaretoken: csrftoken,
                },
                success: function (data, xhr) {
                    console.log(data)
                }
            });
    }

	render () {
        var blog = this.props.blog;

        var subscribeText;
        if (this.state.subscribed) 
        {
            subscribeText = "subscribe"
        }
        else {
            subscribeText = "unsubscribe"
        }

        return (
            <div className="aboutcard">
                <div className="aboutcard-wrapper">
                    <h1 className="aboutcard-title">{blog.name}</h1>
                    <button>Close</button>
                    <div className="row">
                        <div className="col-sm">
                            <h2 className="aboutcard-about-title">About {blog.name}</h2>
                            <p className="aboutcard-about">{blog.about}</p>
                            <button onClick={this.subscribe} className="subscribe-button">SUBSCRIBE</button>
                            <Authors authors={blog.authors}/>
                        </div>
                        <div className="col-sm">
                            <h2>Recent Posts</h2>
                        </div>
                    </div>
                    <div className="moreinfo">
                    <button>{subscribeText}</button>
                    </div>
                    <div className="nextauthor">
                    <button onClick={this.props.nextBlog}>
                    { 

                    } Next author</button>
                    </div>
                </div>
            </div>
    	);
  }
}