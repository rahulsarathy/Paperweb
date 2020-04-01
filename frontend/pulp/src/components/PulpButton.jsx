import React from 'react'

import './PulpButton.scss'

export default function PulpButton(props) {
    return (
        <button className={"pulp-button " + props.className} onClick={props.onClick}>
            {props.children}
        </button>
    )
}
