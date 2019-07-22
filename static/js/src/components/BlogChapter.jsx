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
        // const height = $('#blogchapter' + this.props.index).height();
        // console.log(height);

        var height = this.calculateDifference();
        console.log(height);

        var gradient_style = {
            height: height + 'px',
            top:  28 + 'px',
            backgroundColor: this.props.color
        }
        this.setState(
            {
                gradient_style: gradient_style,
            });
    }

    calculateDifference() {
        var div1 = $('#underline' + this.props.index).offset().top

        if (this.props.index == 0)
        {
            var new_index = this.props.index + 1
            var div2 = $('#underline' + new_index).offset().top

            return (div2 - div1)
        }

        if (this.props.index == 4)
        {
            console.log("index 4 is at " + div1);
            return 520 - div1;
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

        // var to_style = {
        //     width: '400px'
        // }

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