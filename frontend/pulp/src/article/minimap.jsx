import React, { Component } from "react";
import $ from "jquery";

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

	changeScroll(e) {
		let { height, total_height } = this.props;

		// calculate scale factor
		let percent = height / total_height;

		// how large should the minimap highlight be
		let pixels = percent * height;
		let offsetted = e.clientY - pixels / 2;
		this.props.changeScroll(offsetted);
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
		let { offset, height, total_height, width } = this.props;

		// let scale = Math.min(100 / width, total_height / total_height);
		let scale = 100 / 800;

		let minimap_height = scale * total_height;

		// component not yet mounted
		// if (total_height === 0) {
		// 	return <div></div>;
		// }

		// calculate scale factor
		let percent = height / total_height;

		// how large should the minimap highlight be
		let pixels = percent * minimap_height;
		// let pixels = scale * height;

		let percent2 = pixels / minimap_height;

		// // how far down should the minimap highlight be
		// let top = offset * percent;

		// // style for minimap highlight
		// let style = {
		// 	height: pixels + "px",
		// 	top: top + "px",
		// };

		// how far down should the minimap highlight preview be
		let preview_top = this.state.y - pixels / 2.0;

		// style for minimap highlight preview
		let preview_style = {
			height: pixels + "px",
			top: preview_top,
			// position: relative;
		};

		let author_text;
		article_json.author === null || article_json.author === ""
			? (author_text = "")
			: (author_text = "By " + article_json.author);

		let total_distance_to_scroll = minimap_height;
		let minimap_scroll = 0;
		if (minimap_height > height) {
			total_distance_to_scroll = minimap_height - height;
			minimap_scroll =
				(offset * total_distance_to_scroll) / (total_height - height);
			// minimap_scroll = offset * total_distance_to_scroll * scale;
			// minimap_scroll = (offset * total_distance_to_scroll) / 800;
		}

		// how far down should the minimap highlight be
		// percent = pixels / minimap_height;
		let desired_top = height - pixels;

		let progress = minimap_scroll / total_distance_to_scroll;
		// let top = progress * height;
		let top = (offset * desired_top) / (total_height - height);

		// style for minimap highlight
		let style = {
			height: pixels + "px",
			top: top + "px",
		};

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
		console.log("progress is " + progress);
		console.log("offset is " + offset);
		console.log("minimap height is " + minimap_height);
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
