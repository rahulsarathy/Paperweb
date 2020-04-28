import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-bootstrap'
import { changeSetting } from '../../actions/SettingsActions'

function ArchiveLinksForm({ loading, archiveLinks, setArchiveLinks, close }) {
    // We don't want to initialize the react state if the data isn't loaded...
    if (!loading) {
        const [state, setState] = React.useState(archiveLinks)

        function onChange(event) {
            setState(event.target.value == "yes")
        }

        function formSubmitted(e) {
            if (e) e.preventDefault()
            close()
            setArchiveLinks(state)
        }
    
        return (
            <Form onSubmit={formSubmitted}>
                <Form.Group>
                    <Form.Check type="radio" name="archiveLinks" onChange={onChange} value="yes" checked={state} label="Yes, archive articles after they're delivered" />
                    <Form.Check type="radio" name="archiveLinks" onChange={onChange} value="no" checked={!state} label="No, don't archive articles after they're delivered" />
                </Form.Group>

                <Form.Control type="submit" value="Change" />
            </Form>
        )
    } else {
        return <React.Fragment></React.Fragment>
    }
}

function mapStateToProps(state) {
    return {
        loading: state.settings.loading,
        archiveLinks: state.settings.archive_links
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setArchiveLinks: (value) => dispatch(changeSetting("archive_links", value))
    }
}

ArchiveLinksForm = connect(mapStateToProps, mapDispatchToProps)(ArchiveLinksForm)

export default ArchiveLinksForm