import React, { Component } from "react";

import { NavLink } from "react-router-dom";

export default class FAQ extends Component {
	render() {
		return (
			<div className="faq">
				<h1>FAQ</h1>
				<hr></hr>
				<h4>What is Pulp?</h4>
				<p>
					Pulp is a customized, printed, and delivered magazine made
					up of articles that you choose.
				</p>

				<h4>What articles can I add to Pulp?</h4>

				<p>
					You can add any articles you want that are not{" "}
					<NavLink to="/publishers">blacklisted</NavLink> by us.
				</p>

				<h4>How much does Pulp cost?</h4>

				<p>
					A Pulp subscription costs $7.99 per month, for a monthly
					magazine. Shipping and handling is included.
				</p>

				<h4>How often do I receive Pulp magazines?</h4>

				<p>Pulp magazines are delivered once a month.</p>

				<p></p>

				<h4>How can I cancel my subscription?</h4>

				<p>You can cancel your subscription at any time. No mess</p>

				<h4>What countries do you deliver to?</h4>

				<p>Currently Pulp only delivers to the United States.</p>

				<h4>Are PDF files supported?</h4>
				<p>Currently PDF files are not supported.</p>

				<h4>Where can I send my feature requests and suggestions?</h4>

				<p>
					We would love to hear from you. Email us at rahul@getpulp.io
				</p>
			</div>
		);
	}
}
