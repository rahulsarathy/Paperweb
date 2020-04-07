import React, { Component } from "react";
import { Header } from "./components.jsx";

export class Login extends Component {
	render() {
		return (
			<div>
				<Header />
			</div>
		);
	}
}

ReactDOM.render(<Login />, document.getElementById("login"));
