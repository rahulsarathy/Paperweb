import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';

import {Category} from './components/Components.jsx'


export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			data: {},
	};
	}

    componentDidMount() {
    	this.getBlogs();
    }

    getBlogs() {
    	$.ajax(
    		{
    			url: '/api/blogs',
    			type: 'GET',
    			success: function(data)
    			{
    				console.log(data);
    				this.setState(
    					{
    						data: data
    					});
    			}.bind(this)

    		});
    }

    // Uppercase first letter in javascript
    jsUcfirst(string) 
    {
    	return string.charAt(0).toUpperCase() + string.slice(1);
    }

	render () {
		return (
    	<div className="dashboard">
    	{
    		Object.keys(this.state.data).map((category) =>
    			<Category key={shortid.generate()} category={this.jsUcfirst(category)} blogs={this.state.data[category]}/>
    			)
    	}
    	</div>
    	);
  }
}

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'))

