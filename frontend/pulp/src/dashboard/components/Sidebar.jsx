import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

/**
 * An item in the sidebar. Wraps a react-router navlink to apply custom styles.
 * 
 * @param {Object} props
 * @param {string} props.to where this menu item redirects to.
 * @param {Object} props.children the content to show in this menu item.
 */
function MenuItem(props) {
    return (
        <NavLink
            to={props.to}
            className="menu-item"
            activeClassName="menu-item-selected"
        >
            {props.children}
        </NavLink>
    )
}

/**
 * The omnipresent sidebar for the dashboard.
 * 
 * @param {Object} props
 * @param {boolean} props.paid Whether or not the user has paid for a pulp
 *     subscription.
 */
function Sidebar({ paid }) {
    return (
        <div className="sidebar">
            <MenuItem to="/reading_list">Unread</MenuItem>
            <MenuItem to="/delivery">Delivery</MenuItem>
            <MenuItem to="/archive">Archive</MenuItem>
            <MenuItem to="/settings">Settings</MenuItem>
            {!paid &&
                <MenuItem to="/payments">Subscribe</MenuItem>
            }
        </div>
    );
}

function mapStateToProps(state, ownProps) {
    return {
        paid: state.user.subscribed
    }
}

Sidebar = connect(mapStateToProps)(Sidebar)

export default Sidebar