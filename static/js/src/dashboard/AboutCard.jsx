import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Row, Col } from 'react-bootstrap';
import {Authors} from './Components.jsx';

export default class AboutCard extends React.Component {

	constructor(props) {
		super(props);

        this.subscribe = this.subscribe.bind(this)
		this.unsubscribe = this.unsubscribe.bind(this)

		this.state = {
            subscribed: false
		};
	}

    componentDidMount() {
        this.checkSubStatus();
    }

    nextAuthor() {
        if  (this.state.author == this.props.blog.authors.length) {
           
        }

        this.setState(
            {
                author: this.state.author + 1
            });
    }

    checkSubStatus() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var data = {
            csrfmiddlewaretoken: csrftoken,
            name_id: this.props.blog.name_id,
        }
        $.ajax(
            {
                url: '/api/blogs/check_sub_status/',
                type: 'POST',
                data: data,
                success: function(data) {
                    if (data){
                        this.setState(
                            {
                                subscribed: true
                            });
                    }
                }.bind(this)
            });
    }

    subscribe() {
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
                    this.setState({
                        subscribed: true
                    });
                }.bind(this)
            });
    }

    unsubscribe() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        $.ajax(
            {
                url: '/api/blogs/unsubscribe/',
                type: 'POST',
                data: {
                    name_id: this.props.blog.name_id,
                    csrfmiddlewaretoken: csrftoken,
                },
                success: function (data, xhr) {
                    this.setState({
                        subscribed: false
                    });
                }.bind(this)
            });
    }

	render () {
        var blog = this.props.blog;

        return (
            <div className="aboutcard">
                <div className="aboutcard-wrapper">
                    <h1 className="aboutcard-title">{blog.name}</h1>
                    <button>Close</button>
                    <Row>
                        <Col>
                            <h2 className="aboutcard-about-title">About {blog.name}</h2>
                            <p className="aboutcard-about">{blog.about}</p>
                            { 
                                this.state.subscribed ? <button onClick={this.unsubscribe} className="subscribe-button">unsubscribe</button> :
                                <button onClick={this.subscribe} className="subscribe-button">subscribe</button>
                            }
                            <Authors authors={blog.authors}/>
                        </Col>
                        <Col>
                            <h2>Recent Posts</h2>
                        </Col>
                    </Row>
                    <div className="moreinfo">
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