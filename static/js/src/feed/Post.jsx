import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal } from 'react-bootstrap';
import $ from 'jquery';

class BlogContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render () {
        return (
            <div className="post-modal">
                <iframe src={this.props.url}></iframe>
            </div>
            );
    }
}

export default class Post extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            show: false
        };
    }

    handleClick(e) {
        this.setState({
            show: true
        });
    }

    closeModal() {
        this.setState({
            show: false
        });
    }


    render () {
        var post = this.props.post;
        return (
            <div className="post" onClick={this.handleClick}>
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header>
                    <Modal.Title>{post.title}</Modal.Title>
                </Modal.Header>
                <BlogContent url={post.permalink}/>
            </Modal>
            <p>{post.blog_name} published <a target="_blank" href={post.permalink}>{post.title}</a> by {post.author}</p>
            </div>
        );
  }
}


