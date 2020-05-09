import React from "react";
import { connect } from 'react-redux';
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import './Header.scss'

const images_url = "/static/images/";

/**
 * A component for the profile button. Includes a forward ref so it can be used
 * in conjunction with react-bootstraps dropdown menus.
 * 
 * @param {Object} props
 * @param {Object} props.children the content to show within the button
 * @param {function} props.onClick a click event handler provided by react
 *     bootstrap
 */
const ProfileButton = React.forwardRef(({ children, onClick }, ref) => {
    return (
        <button ref={ref} onClick={onClick} className="profile dropdown-toggle">
            {children}
        </button>
    )
})

/**
 * The header of the dashboard. Contains the pulp logo and gives the user access
 * to their profile.
 * 
 * @param {Object} props
 * @param {bool} props.loading Whether or not the users information is still loading;
 *     provided by redux.
 * @param {string} props.email the users email address; provided by redux.
 */
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
                    <Dropdown.Item as={Link} to="/settings">
                        Settings
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