import React, { Component } from "react";
import { Viewport, HoverViewport, MiniMapContent } from "./components.jsx";
import $ from "jquery";

// margin_top is defined by how large the header is
const margin_top = 51;

// this width is set in css under $article-width
const article_width = 500;

// this percent is set in css in .zoom-container width
const percent_of_minimap = 40;

// title_offset is defined by how far down the title is from the top of the page
const title_offset = 70;

const scale = percent_of_minimap / article_width;

export default class MiniMap extends Component {
	constructor(props) {
		super(props);

		this.handleMove = this.handleMove.bind(this);
		this.handleClick = this.handleClick.bind(this);

		this.state = {
			scale: 40 / 500,
			yPos: 0,
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

	handleMove(e) {
		if (this.props.show_hover) {
			this.setState({
				yPos: e.clientY,
			});
		}
	}

	handleClick(e) {
		console.log("clicked");

		let { height, total_height } = this.props;
		let { yPos } = this.state;

		let scale = percent_of_minimap / article_width;

		let minimap_height = (total_height - title_offset) * scale;

		// minimap has no scroll

		let pos_on_minimap = yPos + margin_top;

		let percent = pos_on_minimap / minimap_height;

		let final_offset = percent * total_height;

		document.documentElement.scrollTop = document.body.scrollTop = final_offset;
	}

	render() {
		if (this.props.show_summary) {
			return <div></div>;
		}

		let {
			scale,
			minimap_scroll,
			viewport_size,
			viewport_pos,
		} = this.calculateMiniMap();

		// style for minimap highlight
		let style = {
			height: viewport_size + "px",
			top: viewport_pos + "px",
		};

		return (
			<div
				onMouseEnter={this.handleEnterHover}
				onMouseLeave={this.handleLeaveHover}
				className="minimap"
				id="minimap"
				onMouseMove={this.handleMove}
				onClick={this.handleClick}
			>
				<Viewport
					changeScroll={this.props.changeScroll}
					style={style}
					handleLeave={this.handleLeaveView}
					handleEnter={this.handleEnterView}
				/>
				<HoverViewport
					show_hover={this.props.show_hover}
					down={this.props.down}
					onClick={this.changeScroll}
					viewport_size={viewport_size}
					yPos={this.state.yPos}
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
