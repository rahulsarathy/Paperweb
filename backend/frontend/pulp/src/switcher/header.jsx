import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import shortid from "shortid";
import $ from "jquery";

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
        return (
            <div className="header">
                <img
                    className="logo"
                    src={images_url + "pulp_header_logo.svg"}
                />
                <div className="profile-circle">
                    {this.state.email.charAt(0)}
                </div>
                <img className="chevron" src={icon_url + "chevron.svg"} />
            </div>
        );
    }
}
