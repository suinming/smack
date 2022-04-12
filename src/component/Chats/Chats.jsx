import React,{useContext, useEffect, useState} from 'react'
import { UserContext } from '../../App'
import UserAvatar from '../UserAvatar/UserAvatar'
import './Chats.css'
import {dateFormat} from '../../helper/dateFormat.js'

const Chats = ({ chats }) => {
  const {authService, chatService, appSelectedChannel, socketService} = useContext(UserContext)
  const [messages,setMessages] = useState([])
  const [messageBody, setMessageBody] = useState('')

  // typing message hook
  const [typingMessage, setTypingMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setMessages(chats)
  }, [chats])

  useEffect(() =>{
    if(appSelectedChannel.id){
      chatService.findAllMessagesForChannel(appSelectedChannel.id)
      .then(res => setMessages(res))
      // why i can not add .then(res => console.log(res)) 
      // it give me the error at line 48 can not read
      // the undefined length !!messages.length ?
    }
  }, [appSelectedChannel])

  useEffect(() => {
    socketService.getUserTyping((users) => {
      let names = ''
      let userTyping = 0
      // iterate users object
      // users object data type => {userName : channel id}
      for (const [typeUser, chId] of Object.entries(users)) {
        console.log(Object.entries(users));
        console.log(users);
        if(typeUser !== authService.name && chId === appSelectedChannel.id){
          names = (names === '' ? typeUser : `${names},${typeUser}`)
          userTyping += 1
        }
      }
      // set typing messages
      if(userTyping > 0){
        const verb = (userTyping > 1 ? 'are' : 'is')
        setTypingMessage(`${names} ${verb} typing a message ...`)
      } else{
        setTypingMessage('')
      }

    })

  }, [appSelectedChannel])

  const onTyping = ({target:{value}}) => {
    if(!value.length){
      setIsTyping(false)
      socketService.stopTyping(authService.name)
    } else if (!isTyping){
      socketService.startTyping(authService.name,appSelectedChannel.id)
    } else{
      setIsTyping(true)

    }
    setMessageBody(value)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const {name, id, avatarName, avatarColor} = authService
    const user = {
      userName:name,
      userId:id,
      userAvatar:avatarName,
      userAvatarColor:avatarColor
    }
    socketService.addMessage(messageBody, appSelectedChannel.id, user)
    socketService.stopTyping(authService.name)
    setMessageBody('')
  }

  return(
    <div className='chat'>
      <div className="chat-header">
        <h3>#{appSelectedChannel.name}</h3>
        <h4>{appSelectedChannel.description}</h4>
      </div>
      <div className="chat-list">
        {!!messages.length ? 
          messages.map( message => (
          <div className="chat-message" key={message.id}>
            <UserAvatar 
              avatar={{avatarName:message.userAvatar, 
                      avatarColor:message.userAvatarColor}} 
              size='md'/>
            <div className="chat-user">
              <strong>{message.userName}</strong>
              <small>{dateFormat(message.timeStamp)}</small>
              <div className="message-body">{message.messageBody}</div>
            </div>
          </div>)) :
          <div>No messages</div>
        }
      </div>

      <form className='chat-bar' onSubmit={sendMessage}>
        <div className="typing">{typingMessage}</div>
        <div className='chat-wrapper'>
          <textarea 
            onChange={onTyping} 
            value={messageBody}
            placeholder='type the message ...'/>
          <input type="submit" className='submit-btn' value='SEND'/>
        </div>
      </form>

    </div>
  )
}

export default Chats