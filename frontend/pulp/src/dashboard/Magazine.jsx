import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Row, Col } from 'react-bootstrap';

class MagazineCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var blog = this.props.blog;
        var Background = "/static/images/" + blog.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`,
            boxShadow: "0px 2px 4px 0px #808080",
        } 
        if (blog.name_id === "empty_blog") {
            background_image = {
                backgroundColor: '#F9F2E4'
            }
        }

        return (
            <div className="magazinecard" style={background_image}>
            </div>
            );
    }
}

export default class Magazine extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            subscribed: []
		};
	}

    componentDidMount() {
        this.getSubscribed();
    }

    getSubscribed() {
        $.ajax({
            url: '/api/blogs/get_subscriptions',
            type: 'GET',
            success: function(data) {
                var length = data.length;
                var add = 8 - length;
                for (var i =0; i< add; i++)
                {
                    data.push({
                        name_id: 'empty_blog'
                    });
                }
                this.setState({
                    subscribed: data,
                    sub_count: length,
                });
            }.bind(this)
        });
    }

	render () {
        return (
            <div className="magazine">
                <h3>My Magazine</h3>
                <h3>{this.state.sub_count}/8 Blogs</h3>
                {
                    this.state.subscribed.map((blog) =>
                        <MagazineCard blog={blog} key={shortid.generate()}/>
                        )
                }
                <button className="close" onClick={this.props.close}>X</button>
            </div>
    	);
  }
}