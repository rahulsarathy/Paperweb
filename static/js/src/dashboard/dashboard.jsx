import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import { Modal } from 'react-bootstrap';
import {Category, Magazine, Header} from './Components.jsx'


export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);
        this.showMagazine = this.showMagazine.bind(this);
        this.closeMagazine = this.closeMagazine.bind(this);
        this.showAboutCard = this.showAboutCard.bind(this);
        this.hideAboutCard = this.hideAboutCard.bind(this);
		this.state = {
			data: {},
            showMagazine: false,
            selected: {},
        };
    }

    componentDidMount() {
    	this.getBlogs();
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

    showAboutCard(blog) {
        if (blog === this.state.selected) {
            this.setState({
                selected: {}
            });
        }
        else {
            this.setState({
                selected: blog
            });         
        }
    }

    hideAboutCard(blog) {
        this.setState({
            selected: {}
        });
    }

    getBlogs() {
    	$.ajax(
    		{
    			url: '/api/blogs',
    			type: 'GET',
    			success: function(data)
    			{
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
            <div>
                <Header handleClick={this.showMagazine}/>
                <div className="dashboard">
                    <Modal show={this.state.showMagazine} onHide={this.closeMagazine}>
                        <Magazine close={this.closeMagazine}/>
                    </Modal>
                	{
                		Object.keys(this.state.data).map((category) =>
                        {
                            if (this.state.data[category].includes(this.state.selected))
                                return <Category hide={this.hideAboutCard} show={this.showAboutCard} selected={this.state.selected} key={shortid.generate()} category={this.jsUcfirst(category)} blogs={this.state.data[category]}/> 
                            return <Category selected={{}} hide={this.hideAboutCard} show={this.showAboutCard} key={shortid.generate()} category={this.jsUcfirst(category)} blogs={this.state.data[category]}/>
                        })
                	}
                </div>
            </div>
    	);
  }
}

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'))

