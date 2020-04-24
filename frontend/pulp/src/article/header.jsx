import React, { Component } from "react";
import { TableOfContents } from "./components.jsx";

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hide: false,
		};
	}

	componentDidUpdate(prevProps) {
		// hide or show depending on scroll up/down
		if (prevProps.offset > this.props.offset) {
			this.setState({
				hide: false,
			});
		}

		if (prevProps.offset < this.props.offset) {
			this.setState({
				hide: true,
			});
		}
	}

	render() {
		if (this.state.hide) {
			return <div></div>;
		}

		return (
			<div className="article-header">
				<div className="inner-article-header">
					<img src="../static/images/pulp_black_logo.svg"></img>
				</div>
				{/*
				<TableOfContents
					offset={this.props.offset}
					height={this.props.height}
				/>*/}
			</div>
		);
	}
}
