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

		// this width is set in css under $article-width
		let article_width = 500;
		// this percent is set in css in .zoom-container width
		let percent_of_minimap = 40;
		// margin_top is defined by how large the header is
		let margin_top = 51;
		// title_offset is defined by how far down the title is from the top of the page
		let title_offset = 70;
		let scale = percent_of_minimap / article_width;
		// how much of the article is completed
		let progress = offset / (total_height - height);
		// size of header unscaled + distance from article top to header bottom scaled
		let scroll_offset = margin_top + title_offset * scale;
		// how much space does the minimap have in one viewport
		let available = height - scroll_offset;
		// how large is .zoom
		let minimap_height = (total_height - title_offset) * scale;
		// viewport start position
		let viewport_pos_initial = margin_top;
		// viewport end position

		// calculate minimap viewport height
		let viewport_percent = height / total_height;
		let viewport_size = viewport_percent * (total_height * scale);

		let viewport_pos_end = (total_height - height) * scale + margin_top;
		// viewport_pos_end = total_height - viewport_size;

		// values for if minimap fits in one viewport
		let total_distance_to_scroll = 0;
		let minimap_scroll = -1 * scroll_offset;

		// if viewport does not fit in one viewport
		if (minimap_height > available) {
			viewport_pos_end = height - viewport_size;

			total_distance_to_scroll =
				minimap_height - (height - scroll_offset);

			minimap_scroll =
				progress * total_distance_to_scroll - scroll_offset;
		}

		// calculate viewport position
		let viewport_travel = viewport_pos_end - viewport_pos_initial;
		let viewport_pos = progress * viewport_travel + margin_top;

		// console.log("---------------------------");
		// console.log("progress is ", progress);
		// console.log("viewport travel is", viewport_travel);

		// console.log("scale is " + scale);
		// console.log("viewport is " + pixels);
		// console.log("total height is " + total_height);
		// console.log("height is " + height);
		// console.log("available is " + available);
		// console.log("width is " + width);

		// console.log("total_distance_to_scroll is " + total_distance_to_scroll);
		// console.log("minimap_scroll is " + minimap_scroll);
		// console.log("viewport_pos is " + viewport_pos);
		// console.log("offset is " + offset);
		// console.log("minimap height is " + minimap_height);

		return {
			viewport_pos: viewport_pos,
			viewport_size: viewport_size,
			scale: scale,
			minimap_scroll: minimap_scroll,
		};
	}

	render() {
		let {
			scale,
			minimap_scroll,
			viewport_size,
			viewport_pos,
		} = this.calculateMiniMap();

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
