import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import { Row, Col } from 'react-bootstrap';
import {Magazine} from './Components.jsx'
import {BlogCard} from '../dashboard/Components.jsx'

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
    	<div className="landing">
            <h1 className="logo">Pulp</h1>
            <h3 className="questioncopy">What if the internet published a magazine?</h3>
            <div>
                <p>Pulp is a monthly custom print magazine delivered to your doorstep made up of your favorite blogs and newsletters that you choose.</p>
            </div>
            <button>Get Started</button>
            <div className="blogcopy">
                <p>The internet's best writing delivered to your doorstep</p>
            </div>
            <Row>
                <div className="blogrow">
                {
                    this.state.row1.map((blog) => 
                        <BlogCard key={shortid.generate()} blog={blog}/>
                        )
                } 
                </div>
            </Row>
            <Row>
                <div className="blogrow">
                {
                    this.state.row2.map((blog) => 
                        <BlogCard key={shortid.generate()} blog={blog}/>
                        )
                } 
                </div>
            </Row>
    	</div>
    	);
  }
}

ReactDOM.render(<Landing/>, document.getElementById('landing'))

