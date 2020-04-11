import React, { Component } from "react";
import {
	Progress,
	Viewport,
	HoverViewport,
	MiniMapContent,
} from "./components.jsx";
import $ from "jquery";

// these variables are used by render and are sourced by props
let top = 0;
let pixels = 0;
let scale = 0;
let minimap_scroll = 0;

export default class MiniMap extends Component {
	constructor(props) {
		super(props);
		this.handleEnter = this.handleEnter.bind(this);
		this.handleLeave = this.handleLeave.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.changeScroll = this.changeScroll.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.state = {
			show: false,
			y: 0,
			scale: 0,
			down: false,
		};
	}

	componentDidMount() {}

	calculateMiniMap() {
		let { offset, height, total_height, width } = this.props;

		scale = 50 / 500;

		// calculate scale factor
		let percent = height / total_height;

		let minimap_height = scale * total_height;

		// how large should the minimap highlight be
		pixels = percent * minimap_height;

		// let desired_top = height - pixels;
		let desired_top = Math.min(height, minimap_height) - pixels;

		top = (offset * desired_top) / (total_height - height);

		minimap_scroll = 0;

		let total_distance_to_scroll;

		if (minimap_height > height) {
			total_distance_to_scroll = minimap_height - height;
			minimap_scroll =
				(offset * total_distance_to_scroll) / (total_height - height);
		}
		// console.log("---------------------------");
		console.log("scale is " + scale);
		// console.log("viewport is " + pixels);
		console.log("total height is " + total_height);
		// console.log("height is " + height);
		// console.log("width is " + width);

		// console.log("total_distance_to_scroll is " + total_distance_to_scroll);
		// console.log("minimap_scroll is " + minimap_scroll);
		// console.log("top is " + top);
		// console.log("desired top is " + desired_top);
		// console.log("offset is " + offset);
		console.log("minimap height is " + minimap_height);
		console.log(
			"minimap height is " +
				minimap_height / total_height +
				" of total height"
		);

		return {
			top: top,
			pixels: pixels,
			scale: scale,
			minimap_scroll: minimap_scroll,
		};
	}

	handleMove(e) {
		if (this.state.down) {
			this.changeScroll(e);
		} else {
			this.magnifier(true, e.clientY);
		}

		this.setState({
			y: e.clientY,
		});
	}

	magnifier(hover, yPos) {
		let adjusted_y = this.scaleYPosForArticle(
			// yPos + minimap_scroll - pixels / 2
			yPos
		);
		this.props.magnifier(hover, adjusted_y);
	}

	changeScroll(e) {
		let scaledPos = this.scaleYPosForArticle(e.clientY);

		this.props.changeScroll(scaledPos);
	}

	scaleYPosForArticle(yPos) {
		let { height, total_height } = this.props;

		let minimap_height = scale * total_height;

		let progress = (yPos + minimap_scroll) / minimap_height;

		let offset = progress * total_height - height / 2;
		return offset;
	}

	handleLeave(e) {
		this.magnifier(false, e.clientY);

		this.setState({
			show: false,
		});
	}

	handleEnter(e) {
		if (!this.state.down) {
			this.magnifier(true, e.clientY);
		}

		this.setState({
			show: true,
		});
	}

	handleMouseDown(e) {
		this.setState({
			down: true,
		});
	}

	handleMouseUp(e) {
		this.setState({
			down: false,
		});
	}

	render() {
		let { scale, minimap_scroll, pixels, top } = this.calculateMiniMap();

		let author_text;
		article_json.author === null || article_json.author === ""
			? (author_text = "")
			: (author_text = "By " + article_json.author);

		// style for minimap highlight
		let style = {
			height: pixels + "px",
			top: top + "px",
		};

		let preview_top = this.state.y - pixels / 2;

		let preview_style = {
			top: preview_top,
			height: pixels,
		};

		return (
			<div
				onMouseEnter={this.handleEnter}
				onMouseMove={this.handleMove}
				onMouseLeave={this.handleLeave}
				className="minimap"
				onClick={this.changeScroll}
				id="minimap"
			>
				<Viewport
					changeScroll={this.props.changeScroll}
					style={style}
					handleLeave={this.handleLeave}
					handleEnter={this.handleEnter}
					handleMouseDown={this.handleMouseDown}
					handleMouseUp={this.handleMouseUp}
				/>
				<HoverViewport
					show={this.state.show}
					down={this.state.down}
					style={preview_style}
				/>
				<MiniMapContent
					scale={scale}
					createArticle={this.props.createArticle}
					minimap_scroll={minimap_scroll}
				/>
			</div>
		);
	}
}
