import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogChapter extends React.Component {

	constructor(props) {
		super(props);

        this.handleClick = this.handleClick.bind(this);
		
		this.state = {
		};
	}

    componentDidMount() {

      
    }

    handleClick() {
        console.log("Fired");
    }

	render () {
        var blog = this.props.blog;

        var Background = "http://127.0.1:8000/static/images/" + blog.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`
        } 
    return (
        <div className="blogcard" style={background_image} onClick={this.handleClick}>
        </div>
    	);
  }
}