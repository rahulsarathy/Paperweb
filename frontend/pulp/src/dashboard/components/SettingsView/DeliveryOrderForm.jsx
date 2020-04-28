import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-bootstrap'
import { changeSetting } from '../../actions/SettingsActions'

function DeliveryOrderForm({ loading, deliveryOrder, setDeliveryOrder, close }) {
    // We don't want to initialize the react state if the data isn't loaded...
    if (!loading) {
        const [state, setState] = React.useState(deliveryOrder)

        function onChange(event) {
            setState(event.target.value == "yes")
        }

        function formSubmitted(e) {
            if (e) e.preventDefault()
            close()
            setDeliveryOrder(state)
        }
    
        return (
            <Form onSubmit={formSubmitted}>
                <Form.Group>
                    <Form.Check type="radio" name="deliveryOrder" onChange={onChange} value="yes" checked={state} label="Oldest first, deliver the oldest articles in my reading list first" />
                    <Form.Check type="radio" name="deliveryOrder" onChange={onChange} value="no" checked={!state} label="Newest first, deliver the newest articles in my reading list first" />
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
        deliveryOrder: state.settings.deliver_oldest
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setDeliveryOrder: (value) => dispatch(changeSetting("deliver_oldest", value))
    }
}

DeliveryOrderForm = connect(mapStateToProps, mapDispatchToProps)(DeliveryOrderForm)

export default DeliveryOrderForm