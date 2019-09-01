import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';

import {Authors} from './Components.jsx'


export default class AboutCard extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
		};
	}

    componentDidMount() {

    }


	render () {
        var blog = this.props.blog;

        var selected = {}
        if (this.props.selected !== this.props.index)
        {
            selected = {
                'display': 'None'
            }
        }

        return (
            <div className="aboutcard" style={selected}>
                <div className="aboutcard-wrapper">
                    <h1 className="aboutcard-title">{blog.name}</h1>
                    <div className="row">
                        <div className="col-sm">
                            <h2 className="aboutcard-about-title">About {blog.name}</h2>
                            <p className="aboutcard-about">{blog.about}</p>
                            <button className="subscribe-button">SUBSCRIBE</button>
                            <Authors authors={blog.authors}/>
                        </div>
                        <div className="col-sm">
                            <h2>Recent Posts</h2>
                        </div>
                    </div>
                    <button>more info</button>
                    <button onClick={this.props.nextBlog}> Next author</button>
                </div>
            </div>
    	);
  }
}