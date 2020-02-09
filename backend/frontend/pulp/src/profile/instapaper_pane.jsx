import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import {Modal} from 'react-bootstrap';
import {

} from './components.jsx'

class Instapaper_Modal extends React.Component {

  constructor(props) {
    super(props);

    this.showPane = this.showPane.bind(this);
    this.hidePane = this.hidePane.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      username: '',
      password: '',
      show: false,
    };
  }

  showPane() {
    this.setState({
      show: true,
    });
  }

  hidePane() {
    this.setState({
      show: false,
    });
  }

  handleChange(e) {
    var field = e.target.id;
    this.setState({
      [field]: e.target.value
    });
  }

  render() {

    return (
      <div>
        <button onClick={this.showPane}>Import from Instapaper</button>
        <Modal show={this.state.show} onHide={this.hidePane}>
          <h2>Sign into Instapaper</h2>
          <input id="username" onChange={this.handleChange}></input>
          <input id="password"></input>
          <Modal.Footer>
            <button onClick={() => this.props.instapaper(this.state.username, this.state.password)}>Import from Instapaper</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default class Instapaper_Pane extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {

    return (
      <div>
        <Instapaper_Modal instapaper={this.props.instapaper}/>
      </div>
    );
  }
}

// ReactDOM.render(<Profile/>, document.getElementById('profile'))
