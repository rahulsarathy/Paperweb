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

        this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
        this.nextAuthor = this.nextAuthor.bind(this);
		this.state = {
            subscribed: false,
            selected_author: 0,
		};
	}

    componentDidMount() {
        this.checkSubStatus();
    }

    nextAuthor() {
        if  (this.state.selected_author === this.props.blog.authors.length - 1) {
            this.setState({
                selected_author: 0
            });
        }
        else {
            this.setState(
            {
                selected_author: this.state.selected_author + 1
            });
        }
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
                <h1>{blog.display_name}</h1>
                <Row>
                    <Col>
                        <About about={blog.about}/>
                        { 
                            this.state.subscribed ? <button onClick={this.unsubscribe} className="subscribe-button">unsubscribe</button> :
                            <button onClick={this.subscribe} className="subscribe-button">subscribe</button>
                        }
                    </Col>
                    <Col>
                        <AboutAuthor num_authors={blog.authors.length} nextAuthor={this.nextAuthor} author={blog.authors[this.state.selected_author]}/>
                    </Col>
                </Row>

                 <button onClick={this.props.close}>Close</button>
            </div>
    	);
  }
}

class AboutAuthor extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        var author = this.props.author;
        console.log(author);
        return(
        <div className="about-author">
            {
                this.props.num_authors === 1 ? <h2>Author</h2> : <h2>Authors</h2>
            }
            <a href={author.link} target="_blank"><h3>{author.name}</h3></a>
            {
                this.props.num_authors === 1 ? <div></div> : <button onClick={this.props.nextAuthor}>Next Author</button>
            }
            <p>{author.bio}</p>
        </div>)
    }
}

class About extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
        <div className="about">
            <h2>About</h2>
            <p>{this.props.about}</p>
        </div>)
    }
}