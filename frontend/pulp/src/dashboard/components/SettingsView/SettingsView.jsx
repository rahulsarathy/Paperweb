import React from 'react'
import { connect } from 'react-redux'
import View from '../View'
import SettingsItem from './SettingsItem'
import ShippingAdressForm from './ShippingAddressForm'
import { PocketModal, InstapaperModal } from '../Integrations'

import './SettingsView.scss'

function addressToString(address) {
    return (
        <ul>
            <li>{address.name}</li>
            <li>{address.line_1} {address.line_2}</li>
            <li>{address.city}, {address.state} {address.zip}</li>
        </ul>
    )
}

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

function SettingsView({ user, settings, integrations }) {
    return (
        <View>
            <View.Header>
                <View.Title>Settings</View.Title>
            </View.Header>
            <View.Body>
                <Section name="Account Information">
                    <SettingsItem name="Email">{user.email}</SettingsItem>
                    <SettingsItem name="Password" editHref="/accounts/password/change">•••••••••</SettingsItem>
                    <SettingsItem name="Subscription Status" editHref="/payments">
                        {user.subscribed
                            ? "Currently subscribed"
                            : "Not subscribed"
                        }
                    </SettingsItem>
                    <SettingsItem name="Shipping Address" editForm={<ShippingAdressForm />}>
                        {settings.address 
                            ? addressToString(settings.address)
                            : "No shipping address set"
                        }
                    </SettingsItem>
                </Section>
                <Section name="Integration Settings">
                    <SettingsItem name="Instapaper" editComponent={<InstapaperModal text="Edit" />}>
                        {integrations.instapaper.integrated
                            ? "Instapaper is integrated with Pulp"
                            : "Pulp is not integrated with Instapaper"
                        }
                    </SettingsItem>
                    <SettingsItem name="Pocket" editComponent={<PocketModal text="Edit" />}>
                        {integrations.pocket.integrated
                            ? "Pocket is integrated with Pulp"
                            : "Pulp is not integrated with Pocket"
                        }
                    </SettingsItem>
                </Section>
                <Section name="Delivery Settings">
                    {/* TODO fix pop in of the settings!!! */}
                    <SettingsItem name="Archive Delivered Articles">
                        {settings.archive_links
                            ? "Yes, archive articles after they're delivered"
                            : "No, don't archive articles after they're delivered"
                        }
                    </SettingsItem>
                    <SettingsItem name="Delivery Order">
                        {settings.deliver_oldest
                            ? "Oldest first, deliver the oldest articles in my reading list first"
                            : "Newest first, deliver the newest articles in my reading list first"
                        }
                    </SettingsItem>
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