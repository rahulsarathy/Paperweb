import React from 'react'
import './ItemPlaceholder.scss'


export default function ItemPlaceholder() {
    return (
        <div className="list-item-placeholder">
            <div className="placeholder-title"></div>
            <div className="placeholder-info"></div>
            <div className="placeholder-body">
                <div className="placeholder-preview">
                    <div className="placeholder-preview-1"></div>
                    <div className="placeholder-preview-2"></div>
                    <div className="placeholder-preview-3"></div>
                    <div className="placeholder-preview-4"></div>
                </div>
                <div className="placeholder-image"></div>
            </div>
        </div>
    )
}