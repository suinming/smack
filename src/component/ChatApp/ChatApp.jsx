import React,{useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../../App';
import Channels from '../Channels/Channels';
import Modol from '../Modol/Modol';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css'

const ChatApp = (props) => {
    const {authService} = useContext(UserContext)
    const [modol, setModol] = useState(false)

    let navigation = useNavigate()

    const logoutUser = () =>{
        authService.logoutUser()
        setModol(false)
        navigation('/')
    }

    return (
        <div className='chat-app'>
            <nav>
                <h1>Smack Chat</h1>
                <div className='user-avatar' onClick={() => setModol(true)}>
                    <UserAvatar size='sm' className='nav-avatar'/>
                    <div>{authService.name}</div>
                </div>
            </nav>
            <div className="smack-app">
                <Channels/>
            </div>
            <Modol title='Profile' isOpen={modol} close={() => setModol(false)}>
                <div className="profile">
                    <UserAvatar/>
                    <h4>UserName :{authService.name}</h4>
                    <h4>Email :{authService.email}</h4>
                </div>
                <button className='submit-btn logout-btn' onClick={logoutUser}>Logout</button>
            </Modol>
        </div>
    );
}

export default ChatApp;