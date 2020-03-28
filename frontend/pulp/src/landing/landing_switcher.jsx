import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Landing, Publishers, FAQ, Pricing } from "./components.jsx";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	NavLink,
	useHistory,
	withRouter
} from "react-router-dom";

const images_url = "../static/images/";

function Header() {
	return (
		<div id="header" className="header">
			<img className="logo" src={images_url + "pulp_black_logo.svg"} />
			<div className="links">
				<NavLink to="/pricing">Pricing</NavLink>
				<NavLink to="/faq">FAQ</NavLink>
				<NavLink to="/publishers">Publishers</NavLink>
				<a href="/accounts/login">Log in</a>
				<a href="/accounts/signup">Sign Up</a>
			</div>
		</div>
	);
}

export class LandingSwitcher extends Component {
	render() {
		return (
			<Router>
				<Header />
				<div className="content">
					<Switch>
						<Route path="/landing" render={() => <Landing />} />
						<Route
							path="/publishers"
							render={() => <Publishers />}
						/>
						<Route path="/faq" render={() => <FAQ />} />
						<Route path="/pricing" render={() => <Pricing />} />
					</Switch>
				</div>
			</Router>
		);
	}
}

ReactDOM.render(<LandingSwitcher />, document.getElementById("landing"));
