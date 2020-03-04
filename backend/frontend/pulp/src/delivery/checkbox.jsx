import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import shortid from "shortid";
import "bootstrap/dist/css/bootstrap.css";

const icon_url = "../static/icons/";

export default class CheckBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		let className;
		if (this.props.checked) {
			className = "selected";
		} else {
			className = "unselected";
		}
		return (
			<div
				onClick={this.props.onChange}
				className={"checkbox " + className}
			></div>
		);
	}
}
