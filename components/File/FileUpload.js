import React from 'react';

import './FileUpload.scss';

const FileUpload = (props) => {
    const defaultHandler = (e) => {
        e.preventDefault();
    }

    const clickHandler = (e) => {
        if (props.isDisabled) {
            e.preventDefault();
        }
    }
    let className = 'exp-button exp-button__new';
    className += props.isDisabled ? ' disabled' : '';

    return (
        <div className="xp-file-upload">
            <label
                htmlFor='fileUpload'
                className={className}
            >
                <input
                    id="fileUpload"
                    type="file"
                    accept={props.type ? props.type : ""}
                    onClick={clickHandler}
                    onChange={props.isDisabled ? defaultHandler : props.uploadHandler}
                />
                {props.text ? props.text : 'Upload'}
            </label>

        </div>
    );
}

export default FileUpload