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

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.state = {
      subscribed: false,
      selected: 0
    };
  }

  componentDidMount() {
    this.checkSubStatus();
  }

  changeSelected(index) {
    this.setState({selected: index});
  }

  checkSubStatus() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    var data = {
      csrfmiddlewaretoken: csrftoken,
      name_id: this.props.blog.name_id
    }
    $.ajax({
      url: '/api/blogs/check_sub_status/',
      type: 'POST',
      data: data,
      success: function(data) {
        if (data) {
          this.setState({subscribed: true});
        }
      }.bind(this)
    });
  }

  subscribe() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      url: '/api/blogs/subscribe/',
      type: 'POST',
      data: {
        name_id: this.props.blog.name_id,
        csrfmiddlewaretoken: csrftoken
      },
      success: function(data, xhr) {
        this.setState({subscribed: true});
      }.bind(this)
    });
  }

  unsubscribe() {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      url: '/api/blogs/unsubscribe/',
      type: 'POST',
      data: {
        name_id: this.props.blog.name_id,
        csrfmiddlewaretoken: csrftoken
      },
      success: function(data, xhr) {
        this.setState({subscribed: false});
      }.bind(this)
    });
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
