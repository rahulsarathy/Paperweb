import React from 'react';
import $ from 'jquery';
import {Magazine} from '../components/Components.jsx'

export default class Landing extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

	render () {
    return (
    	<div>
    		<div className="container">
    			<div className="row">
    				<div className="col-sm">
    			    	<h1>What if the internet published a magazine?</h1>
    				</div>
    			</div>
    			<div className="row">
    				<div className="col-sm-6">
    					<Magazine />
    				</div>
    				<div className="col-sm-6">
    					<p>Pulp is a monthly custom print magazine delivered to your doorstep made up of your favorite blogs and newsletters that you choose.</p>
    					<input></input>
    					<button>Get Started</button>
    				</div>
    			</div>
    		</div>
    	</div>
    	);
  }
}