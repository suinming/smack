import React from 'react';
import PropTypes from 'prop-types';
import './Modol.css'

const  Modol = ({children, title, close, isOpen}) => {
    return(
    <>
    {isOpen ? (
        <div className="modol">
        <div className="modol-dialog" >
            <div className="modol-content">
                <div className="modol-header">
                    <h5 className='modol-title'>{title}</h5>
                    <button className='close' onClick={() => close(false)}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    </div>
    ) : null
    }
    </>)
}

Modol.propTypes = {
    title:PropTypes.string,
    close:PropTypes.func,
    isOpen:PropTypes.bool,
}

Modol.defaultProps = {
    title:'Title',
    close: () => {},
    isOpen: false,
}

export default Modol;