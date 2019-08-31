import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogCard extends React.Component {

	constructor(props) {
		super(props);
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        this.state = {
            hover: false
        }
	}

    componentDidMount() {

      
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

    handleClick(e) {
        // console.log($('.aboutcard'));
        if($(e.target).closest('.category').find('.aboutcard-slider').is(":hidden"))
        {
            console.log("hidden");
        }

        $(e.target).closest('.category').find('.aboutcard-slider').slideToggle()
    }

	render () {
        var blog = this.props.blog;

        var Background = "http://127.0.1:8000/static/images/" + blog.image + ".png"
        var background_image = {
            backgroundImage: `url(${Background})`
        } 
        var show;
        var blur;
        if (this.state.hover) {
            show = {}
            background_image['filter'] = 'blur(3px)'
        }
        else {
            show = {
                'display': 'None'
            }
        }

    return (
        <div className="blogcard" onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
            <div className="blogcard-wrapper">
                <div className="blogcard-content" style={show} onClick={this.props.onClick}>
                    {blog.display_name}
                </div>
                <div className="background-color" style={show}></div>
                <div className="background-image" style={background_image}></div>
            </div>
        </div>
    	);
  }
}