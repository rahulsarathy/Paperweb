import React from 'react'

import './View.scss'

function View(props) {
    return (
        <div className="view">
            {props.children}
        </div>
    )
}

function Header(props) {
    return (
        <div className="view-header">
            {props.children}
        </div>
    )
}

function Title(props) {
    return (
        <h1 className="view-title">{props.children}</h1>
    )
}

function Body(props) {
    return (
        <div className={"view-body " + (props.centered ? "centered" : "")}>
            {props.children}
        </div>
    )
}

View.Header = Header
View.Title = Title
View.Body = Body

export default View;
