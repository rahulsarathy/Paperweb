import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

export default class SubscribePane extends Component {
	constructor(props) {
		super(props);

		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);

		this.state = {
			show: false,
			value: "",
			confirmed: false
		};
	}

	showModal() {
		this.setState({
			show: true
		});
	}

	closeModal() {
		this.setState({
			show: false
		});
	}

	handleChange(e) {
		if (e.target.value === this.props.email) {
			this.setState({
				confirmed: true
			});
		} else {
			this.setState({
				confirmed: false
			});
		}

		this.setState({
			value: e.target.value
		});
	}

	unsubscribe(e) {
		this.props.unsubscribe();

		this.setState({
			show: false
		});
	}

	render() {
		return (
			<div>
				<Modal
					id="unsubscribe-modal"
					show={this.state.show}
					onHide={this.closeModal}
				>
					<h3>Are you sure you want to unsubscribe?</h3>
					Type in your email to confirm.
					<input
						onChange={this.handleChange}
						value={this.state.value}
					></input>
					<Modal.Footer>
						<p>
							Your subscription will end immediately. You will not
							be charged for or receive any magazines not yet
							delivered.
						</p>
						<Button onClick={this.closeModal}>Cancel</Button>
						{this.state.confirmed ? (
							<Button
								id="final-unsubscribe"
								onClick={this.unsubscribe}
							>
								Unsubscribe
							</Button>
						) : (
							<div></div>
						)}
					</Modal.Footer>
				</Modal>
				{this.props.paid ? (
					<div>
						<label className="unsubscribe-text">
							You are currently subscribed to Pulp.
						</label>
						<Button
							id="unsubscribe-button"
							onClick={this.showModal}
						>
							Unsubscribe
						</Button>
					</div>
				) : (
					<div>
						<label>You are not subscribed to pulp</label>
						<a href="../payments">Subscribe</a>
					</div>
				)}
			</div>
		);
	}
}
