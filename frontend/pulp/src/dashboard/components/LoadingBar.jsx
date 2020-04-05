import React from 'react'

import './LoadingBar.scss'

export default function LoadingBar({ percent }) {
    let style = {
        width: percent + "%"
    }
    
    return <div className="loading-bar" style={style}></div>
}