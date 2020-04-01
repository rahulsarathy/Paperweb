import React from 'react'
import { connect } from 'react-redux'
import View from '../View'
import ReadingListItem from './ReadingListItem'
import NoItems from '../NoItems'
import AddItemModal from '../AddItemModal'

import './ReadingListView.scss'

function ReadingListView({ readingList }) {
    return (
        <View>
            <View.Header>
                <View.Title>Your Print List</View.Title>
                {readingList.length > 0 
                    && <AddItemModal>Add Article</AddItemModal>}
            </View.Header>
            <View.Body centered={readingList.length == 0}>
                {readingList.length > 0
                    ? readingList.map(item => <ReadingListItem key={item.url} item={item} />)
                    : <NoItems />
                }
            </View.Body>
        </View>
    )
}

function mapStateToProps(state) {
    return {
        readingList: state.readingList
    }
}

ReadingListView = connect(mapStateToProps)(ReadingListView)

export default ReadingListView