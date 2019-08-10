import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogChapter extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
           
		};
	}

    componentDidMount() {

      
    }

	render () {
        var Background = "http://127.0.1:8000/static/images/" + this.props.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`
        } 
    return (
        <div className="blogcard" style={background_image}>
        </div>
    	);
  }
}