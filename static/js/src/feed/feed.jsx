import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import {Post, Header} from './Components.jsx'


export default class Feed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();

        $.ajax({
            url: '/api/blogs/get_posts',
            type: 'GET',
            success: function(data) {
                this.setState({
                    posts: data
                });
            }.bind(this)
        });
    }

    render () {
        return (
            <div>
                <Header />
                <h1>Feed</h1>
                {this.state.posts.map((post) =>
                    <Post post={post} key={shortid.generate()}/>
                    )}
            </div>
        );
  }
}

ReactDOM.render(<Feed/>, document.getElementById('feed'))

