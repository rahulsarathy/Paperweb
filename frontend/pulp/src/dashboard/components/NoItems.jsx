import React from 'react'
import { PocketModal, InstapaperModal} from './Integrations'
import AddItemModal from './AddItemModal'

import './NoItems.scss'

const image_url = "/static/images/"

/**
 * The component shown when the user doesn't have any items in their reading
 * list already. The view is meant to prompt them to add some things to their
 * reading list or sync their accounts with their other reading lists.
 * 
 * @param {Object} props
 * @param {function} showModal 
 */
export default function NoItems() {
    return (
        <React.Fragment>
            <img className="empty-img" src={image_url + "pulp_gray_logo.svg"} />
            <h2 className="empty-header">Your reading list is empty</h2>
            <p>Sync Pulp with your already existing reading lists</p>
            <div className="empty-integrations">
                <PocketModal />
                <InstapaperModal />
            </div>
            <p>Or add an article directly</p>
            <AddItemModal />
        </React.Fragment>
    )
}
