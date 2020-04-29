import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import PulpButton from '../../../components/PulpButton'
import { integratePocket, removePocket } from '../../actions/PocketActions'

import './PocketModal.scss'

const image_url = "/static/images/pocket_logo.svg"

/**
* The pocket integration button and associeted popup displayed when the button
* is pressed. Collects pocket integration confirmation from the user.
*
* Optionally the button can be exchanged for a link if the `text` parameter is
* passed.
*
* @param {Object} props
* @param {string} props.text Text for the link to be shown in place of the button. The
*     link is shown only if this parameter is defined.
* @param {boolean} props.integrated A boolean from redux that indicates whether the
*     current user has integrated Pulp with Pocket or not. True => Integrated,
*     False => Not.
* @param {function} props.integrateWithPocket A redux dispatch function to integrate
*     the current users pocket account with Pulp.
* @param {function} props.removePocketIntegration A redux dispatch function to remove
*     the current users pocket integration.
*/
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

    // Decide whether to render the thing that opens up the pop up as a button
    // or as a link.
    var activator;
    if (text === undefined) {
        activator = (
            <PulpButton className="pocket-button" onClick={handleShow}>
                <img className="pocket-logo" src={image_url} />
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
                    {/* TODO The actual integration doesn't work yet */}
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
