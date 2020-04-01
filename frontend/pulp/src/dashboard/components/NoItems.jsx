import React from 'react'
import { PocketModal, InstapaperModal} from './Integrations'
import AddItemModal from './AddItemModal'

import './NoItems.scss'

const image_url = "/static/images/"

export default function NoItems({ showModal }) {
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
