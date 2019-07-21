import React from 'react';
import $ from 'jquery';


export default class BlogChapter extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
            line_style: {

            },
            color_style: {
                borderBottom: '2px solid' + this.props.color
            }
		};
	}

    componentDidMount() {
        this.measureLength();
    }

    measureLength() {
        var measuringSpan = document.createElement("span");
        measuringSpan.innerText = this.props.blog;
        measuringSpan.style.display = 'none';
        $('#blogname')[0].appendChild(measuringSpan);
        var theWidthYouWant = $(measuringSpan).width();

        var to_style = {
            width: theWidthYouWant + 50 + 'px'
        }

        this.setState(
            {
                line_style: to_style
            });
    }

	render () {
    return (
        <div className="blog-chapter">
            <p id="blogname" className="blog-name">{this.props.blog}</p>
            <div style={Object.assign(this.state.line_style, this.state.color_style)} className="underline"></div>
            <p className="blog-title">{this.props.title}</p>
        </div>
    	);
  }
}