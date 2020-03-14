import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import shortid from "shortid";
import $ from "jquery";
import { Dropdown } from "react-bootstrap";
import { Link, RouterMenuItem, withRouter } from "react-router-dom";

const images_url = "../static/images/";
const icon_url = "../static/icons/";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.getEmail = this.getEmail.bind(this);

        this.state = {
            email: ""
        };
    }

    componentDidMount() {
        this.getEmail();
    }

    getEmail() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        $.ajax({
            url: "../api/users/get_email",
            type: "GET",
            success: function(data) {
                this.setState({
                    email: data
                });
            }.bind(this)
        });
    }

    render() {
        // const RouterMenuItem = withRouter(MenuItem);

        return (
            <div className="header">
                <img
                    className="logo"
                    src={images_url + "pulp_header_logo.svg"}
                />
                <Dropdown>
                    <Dropdown.Toggle className="profile">
                        <div className="profile-circle">
                            {this.state.email.charAt(0)}
                        </div>
                        <div className="chevron">
                            <img src={icon_url + "chevron.svg"} />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/settings">
                            Settings
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}

class MenuItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let className;
        let image_url = "/static/icons/" + this.props.value + ".svg";
        this.props.location.pathname.split("/")[1] === this.props.value
            ? (className = "menu-item-selected")
            : (className = "menu-item");

        return (
            <div className={className} onClick={this.props.onClick}>
                {/*
        this.props.value === 'reading_list'
          ? (<div className="unread">
            <div className="number">{this.props.unread}</div>
          </div>)
          : (<img className="icon" src={image_url}/>)
      */}
                {this.props.text}
            </div>
        );
    }
}
