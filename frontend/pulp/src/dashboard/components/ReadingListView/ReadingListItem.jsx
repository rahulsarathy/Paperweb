import React from 'react'
import { connect } from 'react-redux'
import PulpButton from '../../../components/PulpButton'
import { removeItem, archiveItem } from './redux'

import './ReadingListItem.scss'

function ReadingListItem({ item, onRemoveClick, onArchiveClick }) {
    if (item.placeholder) {
        return false
    }

    var itemURL;
    try {
        itemURL = new URL(item.url)
    } catch (error) {
        itemURL = {
            hostname: item.url,
            href: item.url
        }
    }

    const pulpURL = '/articles/?url=' + encodeURIComponent(item.url)

    return (
        <div className="list-item">
            <div className="list-item-title">
                <h3>
                    <a target="_blank" href={pulpURL}>{item.title}</a>
                </h3>
            </div>

            <div className="list-item-info">
                <a target="_blank" href={itemURL.href}>{itemURL.hostname}</a>
                {item.hasOwnProperty('author') && item.author && " by " + item.author}
            </div>

            <div className="list-item-body">
                <div className="list-item-preview">
                    {item.preview}
                </div>

                <div className="list-item-image">
                    {item.hasOwnProperty('image') && <img src={item.image} />}
                </div>

                <div className="list-item-controls">
                    <PulpButton onClick={() => onRemoveClick(item.url)}>Remove</PulpButton>
                    <PulpButton onClick={() => onArchiveClick(item.url)}>Archive</PulpButton>
                </div>
            </div>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        onRemoveClick: url => dispatch(removeItem(url)),
        onArchiveClick: url => dispatch(archiveItem(url)),
    }
}

ReadingListItem = connect(null, mapDispatchToProps)(ReadingListItem)

export default ReadingListItem