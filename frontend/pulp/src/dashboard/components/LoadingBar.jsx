import React from 'react'
import { connect } from 'react-redux'

import './LoadingBar.scss'

/**
 * A loading bar meant to be shown under the header.
 * 
 * @param {Object} props
 * @param {integer} props.percent the percentage of loading progress. Handed to
 *     the loading bar by redux. There are redux events to change the
 *     percentage.
 */
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