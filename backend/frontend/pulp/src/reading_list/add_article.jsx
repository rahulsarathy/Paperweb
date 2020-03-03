import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

export default class AddArticle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="add-article">
        {this.props.empty ? (
          <div></div>
        ) : (
          <button className="add-article-button" onClick={this.props.onClick}>
            Add Article
          </button>
        )}
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <input
            placeholder="Input an article URL"
            value={this.props.value}
            onChange={this.props.onChange}
          ></input>
          <button onClick={this.props.addToList}>Add Article</button>
          <Modal.Footer>
            <Button variant="primary" onClick={this.props.handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
