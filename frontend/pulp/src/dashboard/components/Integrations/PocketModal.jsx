import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import PulpButton from '../../../components/PulpButton'
import { integratePocket, removePocket } from './redux'

import './PocketModal.scss'

const image_url = "/static/images/"

function PocketModal({ integrated, integrateWithPocket, removePocketIntegration }) {
    const [show, setShow] = React.useState(false)

    const handleHide = () => setShow(false)
    const handleShow = () => setShow(true)

    function handleRemovePocket() {
        removePocketIntegration()
        handleHide()
    }

    function handleIntegratePocket() {
        integrateWithPocket()
        handleHide()
    }

    return (
        <React.Fragment>
            <PulpButton className="pocket-button" onClick={handleShow}>
                <img className="pocket-logo" src={image_url + "pocket_logo.svg"} />
            </PulpButton>

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
                        : <Button variant="primary" onclick={handleIntegratePocket}>Import from Pocket</Button>
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
