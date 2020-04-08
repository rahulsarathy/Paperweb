import React from 'react'
import { connect } from 'react-redux'
import View from '../View'
import { PocketModal, InstapaperModal } from '../Integrations'

import './SettingsView.scss'

function Section({ name, children }) {
    return (
        <div className="settings-section">
            <h3 className="settings-section-header">{name}</h3>
            <ul className="settings-section-content">
                {children}
            </ul>
        </div>
    )
}

function Item({ name, editComponent, editHref, editText = "Edit", children }) {
    return (
        <li className="settings-item">
            <div className="settings-item-name">{name}</div>
            <div className="settings-item-content">
                {children}
            </div>
            <div className="settings-item-edit">
                {editComponent
                    ? editComponent
                    : <a href={editHref}>{editText}</a>
                }
            </div>
        </li>
    )
}

function SettingsView({ user, integrations }) {
    return (
        <View>
            <View.Header>
                <View.Title>Settings</View.Title>
            </View.Header>
            <View.Body>
                <Section name="Account Information">
                    <Item name="Email">{user.email}</Item>
                    <Item name="Password" editHref="/accounts/password/change">•••••••••</Item>
                    <Item name="Subscription Status">
                        {user.subscribed
                            ? "Currently subscribed"
                            : "Not subscribed"
                        }
                    </Item>
                    <Item name="Shipping Address">
                        {user.address 
                            ? user.address.text
                            : "No shipping address set"
                        }
                    </Item>
                </Section>
                <Section name="Integration Settings">
                    <Item name="Instapaper" editComponent={<InstapaperModal text="Edit" />}>
                        {integrations.instapaper.integrated
                            ? "Instapaper is integrated with Pulp"
                            : "Integrate Pulp with Instapaper"
                        }
                    </Item>
                    <Item name="Pocket" editComponent={<PocketModal text="Edit" />}>
                        {integrations.pocket.integrated
                            ? "Pocket is integrated with Pulp"
                            : "Integrate Pulp with Pocket"
                        }
                    </Item>
                </Section>
                <Section name="Delivery Settings">
                    <Item name="Archive Delivered Articles">
                        Yes {/* TODO */}
                    </Item>
                    <Item name="Delivery Order">
                        Oldest First {/* TODO */}
                    </Item>
                </Section>
            </View.Body>
        </View>
    )
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
        settings: state.settings,
        integrations: state.integrations,
    }
}

SettingsView = connect(mapStateToProps)(SettingsView)

export default SettingsView