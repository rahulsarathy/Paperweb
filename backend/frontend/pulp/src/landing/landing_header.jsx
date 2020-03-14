import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import shortid from "shortid";
import $ from "jquery";

const images_url = "../static/images/";
const icon_url = "../static/icons/";

export default class LandingHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="header">
				<img
					className="logo"
					src={images_url + "pulp_header_logo.svg"}
				/>
				<div className="links">
					<p>
						<a href="/accounts/login">Login</a>
					</p>
					<p>
						<a href="/accounts/signup">Sign up</a>
					</p>
				</div>
			</div>
		);
	}
}
