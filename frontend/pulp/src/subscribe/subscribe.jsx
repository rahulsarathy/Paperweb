import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import shortid from "shortid";
import { Unpaid } from "./components.jsx";

// article_json is passed to the dom
export default class Subscribe extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h2>Subscribe to Pulp</h2>
				<Unpaid />
			</div>
		);
	}
}

// ReactDOM.render(<Subscribe/>, document.getElementById('subscribe'))
