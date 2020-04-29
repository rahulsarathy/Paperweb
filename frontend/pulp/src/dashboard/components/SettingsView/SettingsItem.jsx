import React from 'react'

/**
* A single setting in the settings view. Has many options to make it one size
* fits all. (TODO Maybe this component could be slimmed down a bit)
*
* The one size fits all model helps maintain visual consistency throughout the
* settings page. There is no validation for the inputs to this component and
* unfortunately it's expected that anyone who uses it will look into how it
* works. (I know, bad design...)
*
* @param {Object} props
* @param {string} props.name The name of the setting.
* @param {React.Component} [props.editComponent] A component that can take the 
*     place of the edit link.
* @param {string} [props.editHref] An alternate href for the edit link.
* @param {React.Component} [props.EditForm] A component that will be shown when 
*     the user clicks the edit link. (Assuming there is no editcomonent provided
*     or alternate edithref)
* @param {string} [props.editText=Edit] Alternate text to display for the edit 
*     link.
* @param {string} [props.cancelText=Cancel] Alternate text to display for the
*     cancel link.
* @param {} props.children - The children of this component should be the
*     description of the current state of the setting. This will be displayed in
*     the body of the settings item.
*/
export default function Item({
    name,
    editComponent,
    editHref,
    EditForm,
    editText = "Edit",
    cancelText="Cancel",
    children
}) {
    const [editing, setEditing] = React.useState(false)

    function showEdit(e) {
        if (e) e.preventDefault()
        setEditing(true)
    }

    function hideEdit(e) {
        if (e) e.preventDefault()
        setEditing(false)
    }

    return (
        <li className={"settings-item " + (editing ? "editing" : "")}>
            <div className="settings-item-main">
                <div className="settings-item-name">{name}</div>
                <div className="settings-item-content">
                    <div className="settings-item-description">
                        {children}
                    </div>

                    {EditForm &&
                        <div className="settings-item-form">
                            <EditForm close={hideEdit} />
                        </div>
                    }
                </div>
                <div className="settings-item-edit">
                    {editComponent
                        ? editComponent
                        : (editing
                            ? <a href="" onClick={hideEdit}>{cancelText}</a>
                            : (editHref
                                ? <a href={editHref} >{editText}</a>
                                : <a href="" onClick={showEdit}>{editText}</a>))
                    }
                </div>
            </div>
        </li>
    )
}