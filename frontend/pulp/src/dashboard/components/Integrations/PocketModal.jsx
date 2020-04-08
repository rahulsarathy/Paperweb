import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import PulpButton from '../../../components/PulpButton'
import { integratePocket, removePocket } from '../../actions/PocketActions'

import './PocketModal.scss'

const image_url = "/static/images/"

function PocketModal({ text, integrated, integrateWithPocket, removePocketIntegration }) {
    const [show, setShow] = React.useState(false)

    const handleHide = (e) => {
        if (e) { e.preventDefault() }
        setShow(false)
    }
    const handleShow = (e) => {
        if (e) { e.preventDefault() }
        setShow(true)
    }

    function handleRemovePocket(e) {
        if (e) { e.preventDefault() }
        removePocketIntegration()
        handleHide()
    }

    function handleIntegratePocket(e) {
        if (e) { e.preventDefault() }
        integrateWithPocket()
        handleHide()
    }

    var activator;
    if (!text) {
        activator = (
            <PulpButton className="pocket-button" onClick={handleShow}>
                <img className="pocket-logo" src={image_url + "pocket_logo.svg"} />
            </PulpButton>
        )
    } else {
        activator = (
            <a href="" onClick={handleShow}>{text}</a>
        )
    }

    return (
        <React.Fragment>
            {activator}

            <Modal show={show} onHide={handleHide}>
                <Modal.Header>
                    <Modal.Title>
                        {integrated
                            ? "Pocket is integrated with Pulp"
                            : "Integrate Pulp with Pocket"
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHide}>Close</Button>
                    {integrated
                        ? <Button variant="primary" onClick={handleRemovePocket}>Remove Pocket integration</Button>
                        : <Button variant="primary" onClick={handleIntegratePocket}>Import from Pocket</Button>
                    }
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        loading: state.integrations.pocket.loading,
        integrated: state.integrations.pocket.integrated
    }
}

function mapDispatchToProps(dispatch) {
    return {
        integrateWithPocket: () => dispatch(integratePocket()),
        removePocketIntegration: () => dispatch(removePocket()),
    }
}

PocketModal = connect(mapStateToProps, mapDispatchToProps)(PocketModal)

export default PocketModal
