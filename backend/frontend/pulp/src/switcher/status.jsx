import React, { Component } from "react";

export default class Status extends Component {
	render() {
		return (
			<div className="status">
				<Task />
			</div>
		);
	}
}

class Task extends Component {
	render() {
		let style = {
			width: "80%"
		};
		return (
			<div className="task" style={style}>
				<p>Importing 30/50 Articles from Instapaper</p>
				<div className="progress"></div>
			</div>
		);
	}
}
