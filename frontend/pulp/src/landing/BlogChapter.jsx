import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class BlogChapter extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
            line_style: {

            },
            color_style: {
                borderBottom: '2px solid' + this.props.color
            },
            gradient_style: {
                height: '0px',
                top: '0px'
            }
		};
	}

    componentDidMount() {
        this.measureLength();
        this.measureHeight();
      
    }

    measureHeight() {

        var height = this.calculateDifference();

        var next_color;
        if (this.props.index == 4 ) {
            next_color = '#B3AB9D'
        }
        else {

            var next_index = this.props.index + 1;

            var next_color_string = $('#underline' + next_index);

            var color_array = next_color_string.css("border-bottom").split("solid ");

            next_color = color_array[1];
        }

        var gradient_style = {
            height: height + 'px',
            top:  8 + 'px',
            backgroundImage: 'linear-gradient(' + this.props.color + ', ' + next_color + ')'
            // backgroundColor: this.props.color
        }

        this.setState(
            {
                gradient_style: gradient_style,
            });
    }

    calculateDifference() {
        var div1 = $('#underline' + this.props.index).offset().top

        if (this.props.index == 4)
        {
            var bottom = $('.magazine').offset().top + 520;
            return bottom - div1;
        }

        var new_index = this.props.index + 1
        var div2 = $('#underline' + new_index).offset().top

        return div2 - div1;
    }

    measureLength() {
        var measuringSpan = document.createElement("span");
        measuringSpan.innerText = this.props.blog;
        measuringSpan.style.display = 'none';
        $('#blogname' + this.props.index)[0].appendChild(measuringSpan);
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
        <div>
            <div id={"blogchapter" + this.props.index} className="blog-chapter">
                <p id={"blogname" + this.props.index} className="blog-name">{this.props.blog}</p>
                <div id={"underline" + this.props.index} style={Object.assign(this.state.line_style, this.state.color_style)} className="underline"></div>
                <p className="blog-title">{this.props.title}</p>
                <div className="gradient" style={this.state.gradient_style}></div>
            </div>

        </div>
    	);
  }
}