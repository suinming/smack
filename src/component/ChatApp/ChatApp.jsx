import React,{useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../../App';
import Channels from '../Channels/Channels';
import Chats from '../Chats/Chats';
import Modol from '../Modol/Modol';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css'

const ChatApp = (props) => {
    const {authService, chatService, socketService} = useContext(UserContext)
    const [modol, setModol] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [unreadChannels, setUnreadChannels] = useState([])

    let navigation = useNavigate()

    const logoutUser = () =>{
        authService.logoutUser()
        setModol(false)
        navigation('/')
    }

    useEffect(() => {
        socketService.establishConnection()
        return () => socketService.closeConnection()
    }, [])

    useEffect(() => {
        socketService.getChatMessage((newMessage, messages) => {
            if(newMessage === chatService.selectedChannel.id){
                //setChatMessages([chatService.messages])
                setChatMessages([messages])
            }

            if(chatService.unreadChannels.length){
                setUnreadChannels(chatService.unreadChannels)
            }
        })
    }, [])


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
                <Channels unread={unreadChannels}/>
                <Chats chats = {chatMessages}/>
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