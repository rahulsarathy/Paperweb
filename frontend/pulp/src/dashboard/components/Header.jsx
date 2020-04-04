import React from "react";
import { connect } from 'react-redux';
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from './../../components/spinner'

import './Header.scss'

const images_url = "/static/images/";

const ProfileButton = React.forwardRef(({ children, onClick }, ref) => {
    return (
        <button ref={ref} onClick={onClick} className="profile dropdown-toggle">
            {children}
        </button>
    )
})

function Header({ loading, email }) {
    return (
        <div className="header">
            <a href="../">
                <img className="logo" src={images_url + "pulp_header_logo.svg"} />
            </a>

            <Dropdown>
                <Dropdown.Toggle as={ProfileButton}>
                    <div className="profile-circle">
                        {/* TODO spinner */}
                        {!loading && email.charAt(0)}
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                        My Account
                    </Dropdown.Item>
                    <Dropdown.Item href="/accounts/logout">
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        loading: state.user.loadingEmail,
        email: state.user.email
    }
}

Header = connect(mapStateToProps)(Header)

export default Header