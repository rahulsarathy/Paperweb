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
            <div className="blogcopy">
                <p>Pulp is a monthly custom print magazine delivered to your doorstep made up of your favorite blogs and newsletters that you choose.</p>
            </div>
            <button className="getstarted"><a href="/api/users/signup">Get Started</a></button>
            <div className="contentcopy">
                <p>The internet's best writing delivered to your doorstep</p>
            </div>
            <div className="bloglist">
                <Row>
                    <Col>
                        <p>Technology</p>
                        <ul>
                            <li><a target="_blank" href="https://stratechery.com/">Stratechery</a></li>
                            <li><a target="_blank" href="https://kwokchain.com/">kwokchain</a></li>
                            <li><a target="_blank" href="https://breakingsmart.com/en/season-1/">breakingsmart</a></li>
                        </ul>
                    </Col>
                    <Col>
                        <p>Economics</p>
                        <ul>
                            <li><a target="_blank" href="https://www.econlib.org/author/bcaplan/">Bryan Caplan</a></li>
                            <li><a target="_blank" href="https://marginalrevolution.com/">Marginal Revolution</a></li>
                        </ul>
                    </Col>
                    <Col>
                        <p>Think Tanks</p>
                        <ul>
                            <li><a target="_blank" href="https://www.mercatus.org/">Mercatus Center</a></li>
                            <li><a target="_blank" href="https://www.aei.org/">AEI</a></li>
                            <li><a target="_blank" href="https://www.hoover.org/">Hoover Institution</a></li>
                            <li><a target="_blank" href="https://www.cato.org/">Cato Institute</a></li>
                        </ul>
                    </Col>
                    <Col>
                        <p>Rationality</p>
                        <ul>
                            <li><a target="_blank" href="https://www.ribbonfarm.com/">ribbonfarm</a></li>
                            <li><a target="_blank" href="https://slatestarcodex.com/">SlateStarCodex</a></li>
                            <li><a target="_blank" href="https://meltingasphalt.com/">Melting Asphalt</a></li>
                            <li><a target="_blank" href="http://www.overcomingbias.com/">Overcoming Bias</a></li>                    
                        </ul>
                    </Col>
                </Row>
            </div>
    	</div>
    	);
  }
}


ReactDOM.render(<Landing/>, document.getElementById('landing'))

