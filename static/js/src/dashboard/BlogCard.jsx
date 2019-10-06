import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogCard extends React.Component {
	constructor(props) {
		super(props);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            hover: false,
            clicked: false
        }
	}

    componentDidMount() {
    }

    handleClick() {
        this.props.show(this.props.blog);
    }

	render () {
        var blog = this.props.blog;
        var Background = "/static/images/" + blog.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`
        } 
        var show;
        var border = {}
        if (this.state.hover) {
            show = {}
            background_image['filter'] = 'blur(3px)'

        }
        else {
            show = {
                'display': 'None'
            }
        }

        if (this.state.clicked) 
        {
            border['borderStyle'] = 'solid';
            border['borderWidth'] = '2px';
            border['borderColor'] = '#0ABAFF';
        }

    return (
        <div className="blogcard-wrapper" onClick={this.handleClick} style={background_image}>
        </div>
    	);
  }
}