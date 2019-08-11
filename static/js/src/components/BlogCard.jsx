import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogCard extends React.Component {

	constructor(props) {
		super(props);

        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
		
		this.state = {
            hover: false
		};
	}

    componentDidMount() {

      
    }

    handleMouseOver() {
        this.setState(
            {
                hover: true
            });
    }

    handleMouseOut() {
        this.setState(
            {
                hover: false
            });
    }



	render () {
        var blog = this.props.blog;

        var Background = "http://127.0.1:8000/static/images/" + blog.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`
        } 
    return (
        <div className="blogcard-wrapper">
            <div className="blogcard" style={background_image} onClick={this.props.onClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                <div className="layer"> 
                </div>
            </div>
            <div className="blogcard-overlay"></div>
        </div>
    	);
  }
}