import React, { Component } from "react";

export default class HoverSection extends Component {
	render() {
		return (
			<div>
				{this.props.hovered ? (
					<div className="hover-section">
						<button
							onClick={() =>
								this.props.removeArticle(this.props.permalink)
							}
						>
							Remove
						</button>
						<button
							onClick={() =>
								this.props.archiveArticle(this.props.permalink)
							}
						>
							Archive
						</button>
					</div>
				) : (
					<div></div>
				)}
			</div>
		);
	}
}
