import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import { Row, Col } from 'react-bootstrap';
import {Magazine} from './components/Components.jsx'


export default class Landing extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

    componentDidMount() {

    }

	render () {
    return (
    	<div>
    		<div className="container">
    			<Row>
    				<Col>
    			    	<h1>What if the internet published a magazine?</h1>
    				</Col>
    			</Row>
    			<Row>
    				<Col>
    					<Magazine />
    				</Col>
    				<Col>
    					<p>Pulp is a monthly custom print magazine delivered to your doorstep made up of your favorite blogs and newsletters that you choose.</p>
    					<input></input>
    					<button>Get Started</button>
    				</Col>
    			</Row>
    		</div>
    	</div>
    	);
  }
}

ReactDOM.render(<Landing/>, document.getElementById('landing'))

