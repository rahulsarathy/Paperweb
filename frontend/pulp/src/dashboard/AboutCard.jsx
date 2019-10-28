import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import shortid from 'shortid';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Row, Col} from 'react-bootstrap';
import {Authors, Menu, AboutAuthor, Overview, Related, More_Info} from './Components.jsx';

export default class AboutCard extends React.Component {

  constructor(props) {
    super(props);

    this.changeSelected = this.changeSelected.bind(this);
    this.state = {
      subscribed: false,
      selected: 0
    };
  }

  changeSelected(index) {
    this.setState({selected: index});
  }


	choosePanel() {
		const {blog} = this.props;

		switch (this.state.selected) {
			case 0:
				return <Overview blog={blog}/>;
			case 1:
				return <Related blog={blog}/>;
			case 2:
				return <More_Info blog={blog}/>
			default:
				return <Overview blog={blog}/>;
		}
	}

  render() {
    let to_render = this.choosePanel();

    return (<div className="aboutcard">
      <Row>
        <Col></Col>
        <Col>
          <Menu changeSelected={this.changeSelected} selected={this.state.selected}/>
        </Col>
        <Col></Col>
      </Row>
      {to_render}
    </div>);
  }
}
