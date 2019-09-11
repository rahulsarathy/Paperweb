import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogCard extends React.Component {

	constructor(props) {
		super(props);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseUp.bind(this);

        this.state = {
            hover: false,
            clicked: false
        }
	}

    componentDidMount() {
    }

    handleMouseUp() {
        this.setState(
            {
                clicked: false
            });
    }

    handleMouseDown() {
        this.setState({
            clicked: true
        });
    }

    handleMouseEnter(e) {
        this.setState(
        {
            hover: true
        });
    }

    handleMouseLeave(e) {
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
        <div 
        className="blogcard" 
        index={this.props.index} 
        onClick={this.props.onClick} 
        onMouseDown={this.handleMouseDown} 
        onMouseUp={this.handleMouseUp} 
        onMouseEnter={this.handleMouseEnter} 
        onMouseLeave={this.handleMouseLeave}>
            <div className="blogcard-wrapper" style={border}>
                <div className="blogcard-content" style={show}>
                    {blog.display_name}
                </div>
                <div className="background-color" style={show}></div>
                <div className="background-image" style={background_image}></div>
            </div>
        </div>
    	);
  }
}