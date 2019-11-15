import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import { Row, Col } from 'react-bootstrap';
import {Header} from './Components.jsx';

export default class Landing extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            row1: [],
            row2: [],
		};
	}

    componentDidMount() {
        this.getLandingBlogs();
    }

    getLandingBlogs() {
        $.ajax({
            url: '/api/blogs/landing_blogs',
            type: 'GET',
            success: function(data) {
                let halfWayThough = Math.floor(data.length / 2);
                let arrayFirstHalf = data.slice(0, halfWayThough);
                let arraySecondHalf = data.slice(halfWayThough, data.length);

                this.setState({
                    row1: arrayFirstHalf,
                    row2: arraySecondHalf,
                });
            }.bind(this)
        });
    }

	render () {
    return (
        <div>
            <Header />
        	<div className="landing">
                <h1 className="logo">Pulp</h1>
                <h3 className="questioncopy">Save your favorite articles, read them at anytime.</h3>
                <div className="blogcopy">
                    <p>Whatever you don't finish, gets delivered to your doorstep.</p>
                </div>
                <button className="getstarted"><a href="/account/signup">Get Started</a></button>
        	</div>
        </div>
    	);
  }
}


ReactDOM.render(<Landing/>, document.getElementById('landing'))
