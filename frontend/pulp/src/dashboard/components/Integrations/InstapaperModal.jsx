import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import PulpButton from '../../../components/PulpButton'
import { integrateInstapaper, removeInstapaper } from './redux'

import './InstapaperModal.scss'

const image_url = "/static/images/"

function PocketModal({ integrationStatus, integrateWithInstapaper, removeInstapaperIntegration }) {
    const [show, setShow] = React.useState(false)

    const handleHide = () => setShow(false)
    const handleShow = () => setShow(true)

    function handleRemoveInstapaper() {
        removeInstapaperIntegration()
        handleHide()
    }

    function handleIntegrateInstapaper(e) {
        e.preventDefault()
        integrateWithInstapaper()
        handleHide()
    }

    var modal;
    if (integrationStatus.integrated) {
        modal = (
            <Modal show={show} onHide={handleHide}>
                <Modal.Header>
                    <Modal.Title>
                        Instapaper is integrated with Pulp
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHide}>Close</Button>
                    <Button variant="primary" onClick={handleRemoveInstapaper}>Remove Instapaper integration</Button>
                </Modal.Footer>
            </Modal>
        )
    } else {
        modal = (
            <Modal show={show} onHide={handleHide}>
                <Modal.Header>
                    <Modal.Title>
                        Sign into Instapaper
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleIntegrateInstapaper}>
                        <label for="username">Instapaper Username:</label>
                        <input type="text" name="username" />
                        <label for="password">Instapaper Password:</label>
                        <input type="password" name="password" />
                    </form>
                    {/* TODO */}
                    {integrationStatus.invalidPassword && <p>Invalid password or username</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHide}>Close</Button>
                    <Button variant="primary" onClick={handleIntegrateInstapaper}>Import from Instapaper</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <React.Fragment>
            <PulpButton className="instapaper-button" onClick={handleShow}>
                <img className="instapaper-logo" src={image_url + "instapaper_logo.png"} />
            </PulpButton>

            {modal}
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        integrationStatus: {
            integrated: state.integrations.instapaper.integrated,
            invalidPassword: false, // TODO
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        integrateWithPocket: () => dispatch(integrateInstapaper()),
        removePocketIntegration: () => dispatch(removeInstapaper()),
    }
}

PocketModal = connect(mapStateToProps, mapDispatchToProps)(PocketModal)

export default PocketModal
