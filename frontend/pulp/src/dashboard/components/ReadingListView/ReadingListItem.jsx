import React from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import PulpButton from '../../../components/PulpButton'

import './ReadingListItem.scss'

function ReadingListItem({ item, onRemoveClick, onArchiveClick }) {
    if (item.placeholder) {
        return false
    }

    const itemURL = new URL(item.url)

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

function removeItem(url) {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        let data = {
            link: url,
            csrfmiddlewaretoken: csrftoken
        };

        dispatch({ type: "REMOVE_ARTICLE", url: url });

        $.ajax({
            url: "/api/reading_list/remove_reading",
            type: "POST",
            data: data,
        }).then(
            (response) => dispatch({ type: "ARTICLE_REMOVED", url: url }),
            (error) => console.log(error) // TODO
        )
    }
}

function archiveItem(url) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    
    return function(dispatch) {
        let data = {
            link: url,
            csrfmiddlewaretoken: csrftoken
        };

        dispatch({ type: "ARCHIVE_ARTICLE", url: url });

        $.ajax({
            url: "/api/reading_list/archive_item",
            type: "POST",
            data: data,
        }).then(
            (response) => dispatch({ type: "ARTICLE_ARCHIVED", url: url }),
            (error) => console.log(error) // TODO
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onRemoveClick: url => dispatch(removeItem(url)),
        onArchiveClick: url => dispatch(archiveItem(url)),
    }
}

ReadingListItem = connect(null, mapDispatchToProps)(ReadingListItem)

export default ReadingListItem