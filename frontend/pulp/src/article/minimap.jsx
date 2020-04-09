import React, { Component } from "react";
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
		this.handleDrag = this.handleDrag.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.state = {
			show: false,
			y: 0,
			scale: 0,
		};
	}

	calculateMiniMap() {
		let { offset, height, total_height, width } = this.props;

		scale = 100 / 800;

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

		console.log("---------------------------");
		console.log("scale is " + scale);
		console.log("viewport is " + pixels);
		console.log("total height is " + total_height);
		console.log("height is " + height);
		console.log("width is " + width);

		console.log("total_distance_to_scroll is " + total_distance_to_scroll);
		console.log("minimap_scroll is " + minimap_scroll);
		console.log("top is " + top);
		console.log("desired top is " + desired_top);
		console.log("offset is " + offset);
		console.log("minimap height is " + minimap_height);
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
		}
		this.setState({
			y: e.clientY,
		});
	}

	changeScroll2(e) {
		let { height, total_height, offset } = this.props;

		// calculate scale factor
		let percent = height / total_height;

		// how large should the minimap highlight be
		// let pixels = percent * height;
		let offsetted = e.clientY - pixels / 2;

		let percent2 = offsetted / height;
		let scaled = percent2 * total_height;

		this.props.changeScroll(scaled);
	}

	changeScroll(e) {
		let scrollTo = 0;

		let position_on_minimap = e.clientY + minimap_scroll;

		let scaledPos = this.scaleYPosForArticle(position_on_minimap);

		this.props.changeScroll(scaledPos);
	}

	scaleYPosForArticle(yPos) {
		let { height, total_height } = this.props;

		let minimap_height = scale * total_height;

		let progress = yPos / minimap_height;

		let offset = progress * total_height - height / 2;
		return offset;
	}

	handleLeave() {
		// console.log("leave");

		this.setState({
			show: false,
		});
	}

	handleEnter() {
		console.log("show");
		this.setState({
			show: true,
		});
	}

	handleDrag(e) {
		console.log("onDragOver");
		this.props.changeScroll(e.clientY);
		this.setState({
			show: false,
		});
	}

	handleMouseDown(e) {
		console.log("mouse down");
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

		return (
			<div
				onMouseEnter={this.handleEnter}
				onMouseMove={this.handleMove}
				onMouseLeave={this.handleLeave}
				className="minimap"
				onClick={this.changeScroll}
			>
				<div
					onClick={this.props.changeScroll}
					style={style}
					className="viewport"
					onMouseEnter={this.handleLeave}
					onMouseLeave={this.handleEnter}
					onDragOver={this.handleDrag}
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
				></div>
				{/*this.state.show ? (
					<div style={preview_style} className="hover-viewport">
						<div className="magnification">
							<img src="/static/images/stratechery1.png" />
						</div>
					</div>
				) : (
					<div></div>
				)*/}
				<div
					className="zoom"
					style={{
						transform: "scale(" + scale + ")",
						top: "-" + minimap_scroll + "px",
					}}
				>
					{this.props.createArticle()}
				</div>
			</div>
		);
	}
}
