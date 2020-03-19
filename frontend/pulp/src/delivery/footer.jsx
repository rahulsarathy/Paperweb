import React, { Component } from "react";
import { PageCount } from "./components.jsx";

export default class Footer extends Component {
	render() {
		return (
			<div className="footer">
				<PageCount
					overflow={this.props.overflow}
					total={this.props.total}
				/>
			</div>
		);
	}
}
