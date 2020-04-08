import React from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import { setAddress } from '../../actions/SettingsActions'

function ShippingAddressForm({ address, setAddress }) {
    const [state, setState] = React.useState({
        name: address.name || "",
        line_1: address.line_1 || "",
        line_2: address.line_2 || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || "",
        country: address.country || "",
    })

    function onChange(event) {
        const name = event.target.name
        const value = event.target.value

        setState(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function formSubmitted(e) {
        e.preventDefault()
        console.log("Submit Pressed")
        setAddress(state)
    }
    
    return (
        <Form onSubmit={formSubmitted}>
            <Form.Group>
                <Form.Label htmlFor="name">Full Name</Form.Label>
                <Form.Control type="text" name="name" value={state.name} onChange={onChange} />
            </Form.Group>

            <Form.Group>
                <Form.Label htmlFor="line_1">Address Line 1</Form.Label>
                <Form.Control type="text" name="line_1" value={state.line_1} onChange={onChange} />
            </Form.Group>

            <Form.Group>
                <Form.Label htmlFor="line_2">Address Line 2</Form.Label> 
                <Form.Control type="text" name="line_2" value={state.line_2} onChange={onChange} />
            </Form.Group>

            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="city">City</Form.Label>
                        <Form.Control type="text" name="city" value={state.city} onChange={onChange} />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="state">State / Province / Region</Form.Label>
                        <Form.Control type="text" name="state" value={state.state} onChange={onChange} />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="zip">Zip Code</Form.Label>
                        <Form.Control type="text" name="zip" value={state.zip} onChange={onChange} />
                    </Form.Group>
                </Col>
            </Form.Row>

            <Form.Group>
                <Form.Label htmlFor="country">Country</Form.Label>
                <Form.Control name="country" as="select" onChange={onChange} custom>
                    <option>United States</option>
                </Form.Control>
            </Form.Group>
            
            <Form.Control type="submit" value="Change Address" />
        </Form>
    )
}

function mapStateToProps(state) {
    return {
        address: state.settings.address || {}
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setAddress: (address) => dispatch(setAddress(address))
    }
}

ShippingAddressForm = connect(mapStateToProps, mapDispatchToProps)(ShippingAddressForm)

export default ShippingAddressForm