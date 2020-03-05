import React, { Component } from "react";

export default class Spinner extends Component {
	render() {
		return (
			<div
				style={{
					transform: "scale(" + this.props.scale + ")"
				}}
				className="lds-spinner"
			>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		);
	}
}
