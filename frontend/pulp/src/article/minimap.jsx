import React, { Component } from "react";
import { Viewport, HoverViewport, MiniMapContent } from "./components.jsx";
import $ from "jquery";

// these variables are used by render and are sourced by props
let top = 0;
let pixels = 0;
let scale = 0;
let minimap_scroll = 0;

export default class MiniMap extends Component {
	constructor(props) {
		super(props);
		this.handleEnterHover = this.handleEnterHover.bind(this);
		this.handleLeaveHover = this.handleLeaveHover.bind(this);

		this.handleEnterView = this.handleEnterView.bind(this);
		this.handleLeaveView = this.handleLeaveView.bind(this);
		this.changeScroll = this.changeScroll.bind(this);

		this.state = {
			show_hover: false,
			scale: 40 / 500,
		};
	}

	componentDidUpdate(prevProps) {
		// if (prevProps.offset != 0 && this.props.offset == 0) {
		// 	console.log(
		// 		"prev offset was " +
		// 			prevProps.offset +
		// 			" new offset is " +
		// 			this.props.offset
		// 	);
		// }
		if (prevProps.yPos !== this.props.yPos) {
			if (this.props.down) {
				this.changeScroll2(this.props.yPos);
			}
		}
	}

	componentDidMount() {}

	calculateMiniMap() {
		let { offset, height, total_height, width } = this.props;
		total_height = total_height;
		let article_width = 500;
		let percent_of_minimap = 40;
		let margin_top = 51;
		// let title_offset = document.getElementById("article-wrapper").offsetTop;
		let title_offset = 70;

		// offset = offset + 41;
		scale = percent_of_minimap / article_width;

		let scroll_offset =
			margin_top + (margin_top + title_offset - margin_top) * scale;

		// calculate scale factor
		let percent = height / total_height;

		let minimap_height = scale * total_height;

		// how large should the minimap highlight be
		pixels = percent * minimap_height;

		// let desired_top = height - pixels;
		// let desired_top = Math.min(height, minimap_height) - pixels;
		let desired_top = Math.min(height - margin_top, minimap_height);
		// let desired_top = -1175;

		// let scroll_offset = title_offset;
		// let scroll_offset = margin_top + (title_offset - margin_top);

		// top = (offset * desired_top) / (total_height - height) + margin_top;

		// top =
		// 	(offset * (desired_top - margin_top)) /
		// 		(total_height - height - margin_top) +
		// 	margin_top -
		// 	scale * (title_offset - margin_top);

		let top = margin_top + (offset / (total_height - height)) * desired_top;

		let total_distance_to_scroll = height;

		let minimap_scroll = -1 * scroll_offset;

		if (minimap_height > height) {
			total_distance_to_scroll = minimap_height - height + scroll_offset;
			minimap_scroll =
				(offset * total_distance_to_scroll) / (total_height - height) -
				scroll_offset;
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

	calculateMiniMap2() {
		let { offset, height, total_height, width } = this.props;

		let article_width = 500;
		let percent_of_minimap = 40;
		let margin_top = 51;
		let title_offset = 70;
		let scale = percent_of_minimap / article_width;

		let scroll_offset =
			margin_top + (margin_top + title_offset - margin_top) * scale;

		let viewport_pos_initial = margin_top;
		let viewport_pos_end = (total_height - height) * scale + margin_top;
		let viewport_travel = viewport_pos_end - viewport_pos_initial;
		let progress = offset / (total_height - height);

		let viewport_pos = progress * viewport_travel + margin_top;

		let minimap_height = total_height * scale;
		let viewport_percent = height / total_height;
		let viewport_size = viewport_percent * minimap_height;

		let minimap_scroll = -1 * scroll_offset;
		let total_distance_to_scroll = 0;

		console.log("---------------------------");
		console.log("scale is " + scale);
		console.log("viewport is " + pixels);
		console.log("total height is " + total_height);
		console.log("height is " + height);
		console.log("width is " + width);

		console.log("total_distance_to_scroll is " + total_distance_to_scroll);
		console.log("minimap_scroll is " + minimap_scroll);
		console.log("viewport_pos is " + viewport_pos);
		// console.log("desired top is " + desired_top);
		console.log("offset is " + offset);
		console.log("minimap height is " + minimap_height);

		return {
			viewport_pos: viewport_pos,
			viewport_size: viewport_size,
			scale: scale,
			minimap_scroll: minimap_scroll,
		};
	}

	// magnifier(hover, yPos) {
	// 	let adjusted_y = this.scaleYPosForArticle(
	// 		// yPos + minimap_scroll - pixels / 2
	// 		yPos
	// 	);
	// 	this.props.magnifier(hover, adjusted_y);
	// }

	handleMove(e) {
		this.setState({});
	}

	changeScroll(e) {
		// console.log(e);
		// console.log("change scroll called");
		let scaledPos = this.scaleYPosForArticle(e.clientY);

		this.props.changeScroll(scaledPos, true);
	}

	changeScroll2(y) {
		// console.log(e);
		// console.log("changescroll2 called");
		let scaledPos = this.scaleYPosForArticle(y);

		this.props.changeScroll(scaledPos, true);
	}

	scaleYPosForArticle(yPos) {
		let { height, total_height } = this.props;

		let minimap_height = scale * total_height;

		let progress = (yPos + minimap_scroll) / minimap_height;

		let offset = progress * total_height - height / 2;
		return offset;
	}

	handleLeaveHover(e) {
		// this.magnifier(false, e.clientY);
		this.setState({
			show_hover: false,
		});
	}

	handleEnterView(e) {
		// console.log("enter view called");
		this.setState({
			show_hover: false,
		});
	}

	handleLeaveView(e) {
		this.setState({
			show_hover: true,
		});
	}

	handleEnterHover(e) {
		if (!this.props.down) {
			// this.magnifier(true, e.clientY);
		}

		this.setState({
			show_hover: true,
		});
	}

	render() {
		let {
			scale,
			minimap_scroll,
			viewport_size,
			viewport_pos,
		} = this.calculateMiniMap2();

		let author_text;
		article_json.author === null || article_json.author === ""
			? (author_text = "")
			: (author_text = "By " + article_json.author);

		// style for minimap highlight
		let style = {
			height: viewport_size + "px",
			top: viewport_pos + "px",
		};

		let preview_top = this.props.yPos - viewport_size / 2;

		let preview_style = {
			top: preview_top,
			height: viewport_size,
		};

		return (
			<div
				onMouseEnter={this.handleEnterHover}
				onMouseLeave={this.handleLeaveHover}
				className="minimap"
				id="minimap"
			>
				<Viewport
					changeScroll={this.props.changeScroll}
					style={style}
					handleLeave={this.handleLeaveView}
					handleEnter={this.handleEnterView}
				/>
				<HoverViewport
					show_hover={this.state.show_hover}
					down={this.props.down}
					style={preview_style}
					onClick={this.changeScroll}
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
