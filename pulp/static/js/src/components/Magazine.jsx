import React from 'react';
import $ from 'jquery';

export default class Magazine extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

	render () {
    return (
        <div>
    	<div className="magazine">
            <div className="binding"></div>
            <div className="content">
                <h1 className="magazine-title">PULP</h1> 
                <p className="subtitle">July 1st to July 31st</p>
                <p className="subtitle">Harry Daly</p>
            </div>
    	</div>
        <div className="page"></div>
        <div className="page2"></div>
        </div>
    	);
  }
}