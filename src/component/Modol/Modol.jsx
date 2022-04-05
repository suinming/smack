import React,{useState} from 'react';
import PropTypes from 'prop-types';
import './Modol.css'

const  Modol = ({children, title, close, isOpen}) => {
    const [bgColor, setBgColor] = useState({background:'rgba(0, 0, 0, 0.4)'})
    const [theme, setTheme] = useState()

    const onChangeValue = (e) => {
       setTheme(e.target.value)
       e.target.value === 'dark' ? 
       setBgColor({background:'rgba(0, 0, 0, 0.4)'}) :
       setBgColor({background:'rgb(245, 245, 220, 0.4)'})
    }

    return(
    <>
    {isOpen ? (
        <div className="modol" style={bgColor}>
        <div className="modol-dialog" >
            <div className="modol-content">
                <div className="modol-header">
                    <h5 className='modol-title'>{title}</h5>
                    <button className='close' onClick={() => close(false)}>&times;</button>
                </div>
                <div className="buttonGroup">
                    <input type="radio" value="dark" name="dark" id="darkBtn"
                        onChange={onChangeValue} checked={theme === 'dark'}/> 
                        <label htmlFor="darkBtn">Dark</label>
                    <input type="radio" value="light" name="light" id='lightBtn'
                        onChange={onChangeValue} checked={theme === 'light'}/>
                        <label htmlFor="lightBtn">Light</label>
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