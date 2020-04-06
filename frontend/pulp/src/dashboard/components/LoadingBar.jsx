import React from 'react'
import { connect } from 'react-redux'

import './LoadingBar.scss'

function LoadingBar({ percent }) {
    if (percent > 0) {
        let style = {
            width: percent + "%"
        }
        
        return <div className="loading-bar" style={style}></div>
    } else {
        return null
    }
}

function mapStateToProps(state) {
    return {
        percent: state.loading.percent
    }
}

LoadingBar = connect(mapStateToProps)(LoadingBar)

export default LoadingBar