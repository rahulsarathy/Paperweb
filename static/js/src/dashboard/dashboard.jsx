import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import { Modal } from 'react-bootstrap';
import {Category, Magazine} from './Components.jsx'


export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);
        this.showMagazine = this.showMagazine.bind(this);
        this.closeMagazine = this.closeMagazine.bind(this);
        this.bindMagazineButton = this.bindMagazineButton.bind(this);
        this.bindMagazineButton();
		this.state = {
			data: {},
            showMagazine: false
        };
    }

    componentDidMount() {
    	this.getBlogs();
    }

    bindMagazineButton() {
        $("#mymagazine").click(this.showMagazine);
    }

    showMagazine() {
        this.setState({
            showMagazine: true
        });
    }

    closeMagazine() {
        this.setState({
            showMagazine: false
        });
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
        <Modal show={this.state.showMagazine} onHide={this.closeMagazine}>
            <Magazine close={this.closeMagazine}/>
        </Modal>
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

