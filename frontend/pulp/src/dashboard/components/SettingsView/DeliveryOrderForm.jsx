import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-bootstrap'
import { changeSetting } from '../../actions/SettingsActions'

/**
 * A simple form that lets the user decide the order they want articles in their
 * reading list to be delivered.
 * 
 * @param {Object} props
 * @param {boolean} props.loading Indicates whether the settings have loaded in
 *     yet.
 * @param {boolean} props.deliveryOrder The current value of the setting.
 * @param {function} props.setDeliveryOrder A redux dispatch function to change
 *     change the value of the setting.
 * @param {function} props.close A callback to close the form.
 */
function DeliveryOrderForm({ loading, deliveryOrder, setDeliveryOrder, close }) {
    // We don't want to initialize the react state if the data isn't loaded...
    if (!loading) {
        const [state, setState] = React.useState(deliveryOrder)

        function onChange(event) {
            setState(event.target.value == "oldest")
        }

        function formSubmitted(e) {
            if (e) e.preventDefault()
            close()
            setDeliveryOrder(state)
        }
    
        return (
            <Form onSubmit={formSubmitted}>
                <Form.Group>
                    <Form.Check type="radio" name="deliveryOrder" onChange={onChange} value="oldest" checked={state} label="Oldest first, deliver the oldest articles in my reading list first" />
                    <Form.Check type="radio" name="deliveryOrder" onChange={onChange} value="newest" checked={!state} label="Newest first, deliver the newest articles in my reading list first" />
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