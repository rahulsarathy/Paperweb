import React from 'react'
import { connect } from 'react-redux'
import View from '../View'
import SettingsItem from './SettingsItem'
import ShippingAdressForm from './ShippingAddressForm'
import ArchiveLinksForm from './ArchiveLinksForm'
import DeliveryOrderForm from './DeliveryOrderForm'
import { PocketModal, InstapaperModal } from '../Integrations'

import './SettingsView.scss'

// Just converts an address object to a nicely formatted component.
function addressToString(address) {
    return (
        <ul>
            <li>{address.name}</li>
            <li>{address.line_1} {address.line_2}</li>
            <li>{address.city}, {address.state} {address.zip}</li>
        </ul>
    )
}

// A simple component meant to represent a group of settings
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

/**
* The main component for the settings page. Displays all the settings and offers
* the user the opportunity to edit them.
* 
* @param {Object} props
* @param {Object} props.user An object from redux containing information about the 
*     current user.
* @param {Object} props.settings An object from redux containing all the users 
*     settings.
* @param {Object} props.integrations An object from redux containing all the users 
*     integration information.
*/
function SettingsView({ user, settings, integrations }) {
    return (
        <View>
            <View.Header>
                <View.Title>Settings</View.Title>
            </View.Header>
            <View.Body>
                <Section name="Account Information">
                    <SettingsItem name="Email">{user.email}</SettingsItem>
                    <SettingsItem name="Password" editHref="/accounts/password/change">••••••••••••</SettingsItem>
                    <SettingsItem name="Subscription Status" editHref="/payments">
                        {/* TODO add an indicator of how much longer there is in
                            their subscription */}
                        {user.subscribed
                            ? "Currently subscribed"
                            : "Not subscribed"
                        }
                    </SettingsItem>
                    <SettingsItem name="Shipping Address" EditForm={ShippingAdressForm}>
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
                    <SettingsItem name="Archive Delivered Articles TODO" EditForm={ArchiveLinksForm}>
                        {settings.archive_links
                            ? "Yes, archive articles after they're delivered"
                            : "No, don't archive articles after they're delivered"
                        }
                    </SettingsItem>
                    <SettingsItem name="Delivery Order TODO" EditForm={DeliveryOrderForm}>
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

function mapStateToProps(state) {
    return {
        user: state.user,
        settings: state.settings,
        integrations: state.integrations,
    }
}

SettingsView = connect(mapStateToProps)(SettingsView)

export default SettingsView