import React from 'react'
import { connect } from 'react-redux'
import View from '../View'

function SettingsView(props) {
    return (
        <View>
            <View.Header>
                <View.Title>Settings</View.Title>
            </View.Header>
            <View.Body>
                TODO
            </View.Body>
        </View>
    )
}

function mapStateToProps(state, ownProps) {
    return state.user
}

SettingsView = connect(mapStateToProps)(SettingsView)

export default SettingsView