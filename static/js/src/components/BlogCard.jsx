import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogCard extends React.Component {

	constructor(props) {
		super(props);
	}

    componentDidMount() {

      
    }

	render () {
        var blog = this.props.blog;

        var Background = "http://127.0.1:8000/static/images/" + blog.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`
        } 
    return (
        <div className="blogcard" >
            <div className="blogcard-wrapper">
                <div className="blogcard-content" onClick={this.props.onClick}>
                    {blog.display_name}
                </div>
                <div className="background-image" style={background_image}></div>

            </div>
        </div>
    	);
  }
}