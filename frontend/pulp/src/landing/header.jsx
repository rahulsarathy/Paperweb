import React, { Component } from "react";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	NavLink,
	useHistory,
	withRouter
} from "react-router-dom";

const images_url = "../static/images/";

export default class header extends Component {
	render() {
		return (
			<div id="header" className="header">
				<div className="inner-header">
					<NavLink to="/landing">
						<img
							className="logo"
							src={images_url + "pulp_black_logo.svg"}
						/>
					</NavLink>
					<div className="links">
						<NavLink to="/faq">FAQ</NavLink>
						<NavLink to="/publishers">Publishers</NavLink>
						<span>|</span>
						<a href="/accounts/login/">Log in</a>
						<a href="/accounts/signup/">Sign Up</a>
					</div>
				</div>
			</div>
		);
	}
}
