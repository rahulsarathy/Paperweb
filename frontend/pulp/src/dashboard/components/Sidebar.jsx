import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

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

function Sidebar({ paid }) {
    return (
        <div className="sidebar">
            <MenuItem to="/reading_list">Unread</MenuItem>
            <MenuItem to="/delivery">Delivery</MenuItem>
            <MenuItem to="/archive">Archive</MenuItem>
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