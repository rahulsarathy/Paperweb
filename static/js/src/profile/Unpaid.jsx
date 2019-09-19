import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';

export default class Unpaid extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		};
	} 


	render () {
        return (
            <div>
                <p>You have not yet subscribed to Pulp.</p>  
                <div>
                    <p>Pulp</p>
                    <p>1 new magazine every month</p>
                    <p>$9.99 a month</p>
                    <button>Get Pulp</button>
                </div> 
            </div>
            );
    }
}