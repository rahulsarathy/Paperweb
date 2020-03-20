import React, { Component } from "react";

export default class Status extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {}

	render() {
		return (
			<div className="status">
				<InstapaperTask
					total={this.props.instapaper_total}
					completed={this.props.instapaper_completed}
				/>
				<PocketTask
					completed={this.props.pocket_completed}
					total={this.props.pocket_total}
				/>
				{this.props.add_to_reading_list.map(task => (
					<Task
						key={task.link}
						link={task.link}
						percent={task.percent}
					/>
				))}
			</div>
		);
	}
}

class Task extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.percent === 100) {
			setTimeout(() => {}, 1000);
		}
		return true;
	}

	render() {
		let style = {
			width: this.props.percent + "%"
		};
		if (this.props.percent === 100) {
			return null;
		}
		return (
			<div className="task">
				<p>Adding {this.props.link}</p>
				<div style={style} className="progress"></div>
			</div>
		);
	}
}

class PocketTask extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.completed === this.props.total) {
			setTimeout(() => {}, 1000);
		}
		return true;
	}
	render() {
		if (
			this.props.total === 0 ||
			this.props.completed === this.props.total
		) {
			return null;
		}

		let percent = (this.props.completed / this.props.total) * 100;

		let style = {
			width: percent + "%"
		};

		return (
			<div className="task">
				<p>
					Importing {this.props.completed}/{this.props.total} articles
					from Pocket
				</p>
				<div style={style} className="import progress"></div>
			</div>
		);
	}
}

class InstapaperTask extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.completed === this.props.total) {
			setTimeout(() => {}, 1000);
		}
		return true;
	}
	render() {
		if (
			this.props.total === 0 ||
			this.props.completed === this.props.total
		) {
			return null;
		}

		let percent = (this.props.completed / this.props.total) * 100;

		let style = {
			width: percent + "%"
		};

		return (
			<div className="task">
				<p>
					Importing {this.props.completed}/{this.props.total} articles
					from Instapaper
				</p>
				<div style={style} className="import progress"></div>
			</div>
		);
	}
}
