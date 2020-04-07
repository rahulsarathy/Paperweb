import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
if (process.env.NODE_ENV == "production") {
	Sentry.init({
		dsn: "https://376f22cb96ba4052a0cb5f47084f452c@sentry.io/1529016",
	});
}

import { Landing, Publishers, FAQ, Pricing, Header } from "./components.jsx";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	NavLink,
	useHistory,
	withRouter,
} from "react-router-dom";

const images_url = "../static/images/";

export class LandingSwitcher extends Component {
	render() {
		return (
			<Router>
				<Header />
				<div className="content">
					<Switch>
						<Route path="/landing" render={() => <Landing />} />
						<Route path="/faq" render={() => <FAQ />} />
						<Route
							path="/publishers"
							render={() => <Publishers />}
						/>
					</Switch>
				</div>
			</Router>
		);
	}
}

ReactDOM.render(<LandingSwitcher />, document.getElementById("landing"));
