import React from 'react'
import { connect } from 'react-redux'
import View from '../View'
import ReadingListItem from './ReadingListItem'
import NoItems from '../NoItems'
import AddItemModal from '../AddItemModal'

import './ReadingListView.scss'

function ReadingListView({ loading, readingList }) {
    return (
        <View>
            <View.Header>
                <View.Title>Your Print List</View.Title>
                {!loading && readingList.length > 0 
                    && <AddItemModal>Add Article</AddItemModal>}
            </View.Header>
            {!loading && //TODO
            <View.Body centered={readingList.length == 0}>
                {readingList.length > 0
                    ? readingList.map(item => !item.archived && <ReadingListItem key={item.url} item={item} />)
                    : <NoItems />
                }
            </View.Body>
            }
        </View>
    )
}

function mapStateToProps(state) {
    return {
        loading: state.readingList.loading, // TODO use this
        readingList: state.readingList.list
    }
}

ReadingListView = connect(mapStateToProps)(ReadingListView)

export default ReadingListView