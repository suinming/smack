import React,{useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../../App';
import Channels from '../Channels/Channels';
import Chats from '../Chats/Chats';
import Modol from '../Modol/Modol';
import UserAvatar from '../UserAvatar/UserAvatar';
import '../UserCreate/UserCreate.css'
import {AVATARS_COUNT} from '../../constant.js'
import './ChatApp.css'
import { ChatService } from '../../services';



const ChatApp = (props) => {
    const {authService, chatService, socketService, appSelectedChannel} = useContext(UserContext)
    const [modol, setModol] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [unreadChannels, setUnreadChannels] = useState([])

    // update 
    const UPDATE_INIT = {name:'',email:authService.email,avatarName:'avatarDefault.png',avatarColor:'none'}
    const [updateUserInfo, setUpdateUserInfo] = useState(UPDATE_INIT)
    const [updateUserModol, setUpdateUserModol] = useState(false)
    const [updateAvatarModal, setUpdateAvatarModal] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

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

    const onChange = ({target:{name,value}}) => {
        setUpdateUserInfo({...updateUserInfo,[name]:value})
    }

    const chooseAvatar = (avatar) =>{
        setUpdateUserInfo({...updateUserInfo,avatarName:avatar})
        setUpdateAvatarModal(false)
    }

    const generateUpdateAvatarBGcolor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16)
        setUpdateUserInfo({...updateUserInfo, avatarColor:`#${randomColor}`})
    }

    const updateChatMessages = (nameBeforeUpdate, {name, avatarName, avatarColor}) => {
        for(const message of chatService.messages){
            if(message.userName === nameBeforeUpdate){
                message.userName = name
                message.userAvatar = avatarName
                message.userAvatarColor = avatarColor
            }
        }
    }

    const updateUser = (e) => {
        e.preventDefault()
        setLoading(true)
        const {name, email, avatarName, avatarColor} = updateUserInfo
        const nameBeforeUpdate = authService.name

        if(!!name && !!email && !!avatarName && !!avatarColor){
            authService
            .updateUser(authService.id, name, email, avatarName, avatarColor)
            .then(() => {
                setUpdateUserModol(false)
                updateChatMessages(nameBeforeUpdate, updateUserInfo)
                setUpdateUserInfo(UPDATE_INIT)
            })
            .catch(error => {
                console.error('update user',error)
                setError(true)
            })
        }
        setLoading(false)
    }

    const {name, email, avatarName, avatarColor} = updateUserInfo

    return (
        <div className='chat-app'>
            <nav>
                <h1>Smack Chat</h1>
                <div className="updateUserBtn" onClick={() => setUpdateUserModol(true)}>updateUser</div>
                {/* update user info*/}
                <Modol title='Update user Info' isOpen={updateUserModol} close={() => setUpdateUserModol(false)}>
                    <form className='form channel-form' onSubmit={updateUser}>
                        <input onChange={onChange} type="text" className='form-control' name='name' placeholder='please enter user name'/>
                        <div className='avatar-container'>
                            <UserAvatar avatar={{ avatarName, avatarColor }} className='create-avatar' />
                            <div className='avatar-text' onClick={() => setUpdateAvatarModal(true)} >Choose avatar</div>
                            <div className='avatar-text' onClick={generateUpdateAvatarBGcolor}>Generate background color</div>
                            <Modol 
                            title={'Choose avatar'} 
                            isOpen={updateAvatarModal} 
                            close={() => setUpdateAvatarModal(false)}
                            >
                                <div className='avatar-list'>
                                    {Array.from({length: AVATARS_COUNT}, 
                                        (v, i) => (
                                            <div role='presentation' key={`/dark${i}`} className='create-avatar' onClick={() => chooseAvatar(`/dark${i}.png`)}>
                                                <img src={`/dark${i}.png`} alt="avatar"/>
                                            </div>
                                        )
                                    )}
                                </div>
                            </Modol>
                        </div>
                        <input type="submit" className='submit-btn' value='Update'/>
                    </form>
                </Modol>
                {/* log out btn*/}
                <div className='user-avatar' onClick={() => setModol(true)}>
                    <UserAvatar size='sm' className='nav-avatar'/>
                    <div>{authService.name}</div>
                </div>
            </nav>
            <div className="smack-app">
                <Channels unread={unreadChannels}/>
                {chatService.channels.length ? 
                    <Chats chats = {chatMessages} />
                    :
                    <h2>add some channel to chat with your friends(if you have ...)</h2>
                }
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