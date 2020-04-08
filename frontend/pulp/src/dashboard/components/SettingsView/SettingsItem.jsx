import React from 'react'

export default function Item({ name, editComponent, editHref, editForm, editText = "Edit", cancelText="Cancel", children }) {
    const [editing, setEditing] = React.useState(false)

    function showEdit(e) {
        e.preventDefault()
        setEditing(true)
    }

    function hideEdit(e) {
        e.preventDefault()
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

                    {editForm &&
                        <div className="settings-item-form">
                            {editForm}
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