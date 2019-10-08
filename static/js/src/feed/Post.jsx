import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

export default class Post extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render () {
        var post = this.props.post;
        return (
            <div>
            <p>{post.blog_name} published <a target="_blank" href={post.permalink}>{post.title}</a></p>
            </div>
        );
  }
}


