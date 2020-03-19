import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

export default class AddArticle extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: ""
    };
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <div className="add-article">
        {this.props.empty ? (
          <div></div>
        ) : (
          <button className="add-article-button" onClick={this.props.showModal}>
            Add Article
          </button>
        )}
        <Modal show={this.props.show_add} onHide={this.props.closeModal}>
          <input
            placeholder="Input an article URL"
            value={this.props.value}
            onChange={this.handleChange}
          ></input>
          <button
            onClick={() => {
              this.props.AddArticle();
            }}
          >
            Add Article
          </button>
          <Modal.Footer>
            <Button variant="primary" onClick={this.props.closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
