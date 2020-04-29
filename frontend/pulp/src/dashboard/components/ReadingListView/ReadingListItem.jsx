import React from 'react'
import { connect } from 'react-redux'
import PulpButton from '../../../components/PulpButton'
import ItemPlaceholder from './ItemPlaceholder'
import { removeItem, archiveItem } from '../../actions/ReadingListActions'

import './ReadingListItem.scss'

/**
* An item in the reading list view. Displays the title of the article, the
* authors name, a link to the article, and a short snippet from the article
* along with a small image from the page.
* 
* @param {Object} props
* @param {Object} props.item The reading list item object containing the data 
*     for this item.
* @param {function} props.onRemoveClick A redux dispatch function to remove an
*     article.
* @param {function} props.onArchiveClick A redux dispatch function to archive an
*     article.
*/
function ReadingListItem({ item, onRemoveClick, onArchiveClick }) {
    // Display a placeholder if the current item is loading.
    if (item.loading) {
        return <ItemPlaceholder />
    }

    // Sometimes the URL is malformed and doesn't get parsed properly. When this
    // happens just use the entire URL as the "hostname". (The hostname is
    // supposed to be just the `example.com` part of `https://www.example.com`
    // but it's not a big deal if this doesn't work)
    var itemURL;
    try {
        itemURL = new URL(item.url)
    } catch (error) {
        itemURL = {
            hostname: item.url,
            href: item.url
        }
    }

    // A link to a page the user can view the entire article in.
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
                {/* Check if the author field exists and is defined... */}
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