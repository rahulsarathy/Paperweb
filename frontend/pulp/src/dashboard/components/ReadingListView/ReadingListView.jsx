import React from 'react'
import { connect } from 'react-redux'
import View from '../View'
import ReadingListItem from './ReadingListItem'
import NoItems from '../NoItems'
import AddItemModal from '../AddItemModal'

import './ReadingListView.scss'

/**
* The main component for the reading_list view.
* 
* @param {Object} props
* @param {Object} props.loading Indicates whether the reading list is loading.
*     Used to conditionally render some elements of the UI.
* @param {Object[]} props.readingList An array containing article objects from redux.
*     These articles are each individually passed to a ReadingListItem
*     component.
*/
function ReadingListView({ loading, readingList }) {
    return (
        <View>
            <View.Header>
                <View.Title>Your Print List</View.Title>
                {!loading && readingList.length > 0 
                    && <AddItemModal>Add Article</AddItemModal>}
            </View.Header>
            {!loading && //TODO add a loading indicator!
            <View.Body centered={readingList.length == 0}>
                {/* Render the reading list only if there is an item */}
                {readingList.length > 0
                    ? readingList.map(
                        (item) => {
                            if (!item.archived)
                                // When rendering an array of components (like 
                                // we are here) React needs each one to have a
                                // key associated with it.
                                return <ReadingListItem key={item.url} item={item} />
                            else
                                // React won't render anything when it sees 
                                // false
                                return false 
                        }
                    )
                    : <NoItems />
                }
            </View.Body>
            }
        </View>
    )
}

function mapStateToProps(state) {
    return {
        loading: state.readingList.loading,
        readingList: state.readingList.list
    }
}

ReadingListView = connect(mapStateToProps)(ReadingListView)

export default ReadingListView