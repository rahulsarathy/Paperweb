import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import PulpButton from '../../components/PulpButton'
import { addArticle } from './ReadingListView/redux'

import './AddItemModal.scss'

function AddItemModal({ addArticle, children }) {
    const [show, setShow] = React.useState(false)

    const handleHide = () => setShow(false)
    const handleShow = () => setShow(true)


    const [value, setValue] = React.useState("")

    function handleChange(event) {
        setValue(event.target.value)
    }

    function onAddArticleClicked(event) {
        event.preventDefault()

        addArticle(value)
        handleHide()
    }

    return (
        <React.Fragment>
            <PulpButton className="add-item-button" onClick={handleShow}>{children ? children : "Add"}</PulpButton>

            <Modal show={show} onHide={handleHide}>
                <Modal.Header>
                    <Modal.Title>Input an article URL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={onAddArticleClicked}>
                        <input type="text" value={value} onChange={handleChange} placeholder="Article URL" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onAddArticleClicked}>
                        Add Article
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        addArticle: url => dispatch(addArticle(url))
    }
}

AddItemModal = connect(null, mapDispatchToProps)(AddItemModal)

export default AddItemModal