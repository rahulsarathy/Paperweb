import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import shortid from "shortid";
import { Unpaid } from "./components.jsx";
import Magazine from "../magazine/magazine.jsx";

// article_json is passed to the dom
export default class Subscribe extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mounted: false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.test !== nextState.test) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		return (
			<div className="subscribe-container">
				<div className="first-half">
					<Unpaid />
				</div>
				<div className="second-half">
					<Magazine />
				</div>
			</div>
		);
	}
}
