import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import shortid from 'shortid';
import classnames from 'classnames';
import {Modal} from 'react-bootstrap';
import {Pocket_Modal} from './components.jsx'

class Instapaper_Modal extends React.Component {

  constructor(props) {
    super(props);

    this.showPane = this.showPane.bind(this);
    this.hidePane = this.hidePane.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.importFromInstapaper = this.importFromInstapaper.bind(this);

    this.state = {
      username: '',
      password: '',
      show: true,
      invalid: false,
      loading: false,
      success: false
    };
  }

  showPane() {
    this.setState({show: true});
  }

  hidePane() {
    this.setState({show: false, loading: false, invalid: false});
  }

  handleChange(e) {
    var field = e.target.id;
    this.setState({[field]: e.target.value});
  }

  importFromInstapaper(username, password) {
    this.setState({loading: true});
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      username: username,
      password: password,
      csrfmiddlewaretoken: csrftoken
    }
    $.ajax({
      url: '../api/reading_list/instapaper',
      data: data,
      type: 'POST',
      success: function(data) {
        this.setState({loading: false});
        console.log(data);
        // this.updateReadingList(data);
      }.bind(this),
      error: function(data) {
        if (data.status === 401) {
          this.setState({invalid: true, loading: false});
        }
      }.bind(this)
    });
  }

  render() {

    return (<div>
      <button onClick={this.showPane}>Import from Instapaper</button>
      <Modal id="instapaper-modal" show={this.state.show} onHide={this.hidePane}>
        <h2>Sign into Instapaper</h2>
        Username
        <input id="username" onChange={this.handleChange}></input>
        Password
        <input id="password"></input>
        <Modal.Footer>
          {
            this.state.invalid
              ? <div className="invalid">
                  Invalid username or password
                </div>
              : <div></div>
          }
          {
            this.state.loading
              ? <div className="loading">
                  Loading...
                </div>
              : <div></div>
          }

          <button onClick={() => this.importFromInstapaper(this.state.username, this.state.password)}>Import from Instapaper</button>
        </Modal.Footer>
      </Modal>
    </div>);
  }
}

export default class Instapaper_Pane extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {

    return (<div>
      <Instapaper_Modal/>
      <Pocket_Modal/>
    </div>);
  }
}

// ReactDOM.render(<Profile/>, document.getElementById('profile'))
