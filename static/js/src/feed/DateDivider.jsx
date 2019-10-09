import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import {Post} from './Components.jsx'

export default class DateDivider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: []
        };
    }



    render () {
        return (
            <div>
            <h1>{this.props.date}</h1>
            {
                this.props.posts.map((post) =>
                    <Post post={post}/>
                    )
            }
            </div>
        );
  }
}

