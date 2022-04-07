import React,{useState, useEffect, useContext} from 'react'
import { UserContext } from '../../App'
import Modol from '../Modol/Modol'
import './Channels.css'

const Channels = () => {
  const INIT = {name:'', description:''}
  const [channels, setChannels] = useState([])
  const [newChannel, setNewChannel] = useState(INIT)
  const {authService, chatService, socketService, appSetChannel, appSelectedChannel} = useContext(UserContext)
  const [modol, setModol] = useState(false)

  useEffect(() => {
    chatService.findAllChannels().then(res => setChannels(res))
  }, [])

  useEffect(() => {
    socketService.getChannel( channelList => {  // change the callback function input from channel to channelList
      setChannels(channelList)
    })
  }, [])

  const selectChannel = (channel) => {
    appSetChannel(channel)
  }

  const onChange = ({target:{name, value}}) => {
    setNewChannel({...newChannel, [name]:value})
  }

  const createChannel = (e) => {
    e.preventDefault()
    socketService.addChannel(newChannel.name, newChannel.description)
    setNewChannel(INIT)
    setModol(false)
  }

  return(
    <>
      <div className="channel">
        <div className="channel-header">
          <h3 className="channel-label">{authService.name}</h3>
        </div>
        <h3 className="channel-label">Channels <span onClick={() => setModol(true)}>Add +</span></h3>
        <div className="channel-list">
          {!!channels.length ? channels.map(channel => (
              <div 
              className="channel-label" 
              key={channel.name}
              onClick={() => selectChannel(channel)}
              >
                  <div className={`inner ${(appSelectedChannel.id === channel.id) ? 'selected': ''}`}>
                    #{channel.name}
                  </div>
              </div>
          )) : <div>No channels. Please add the channel!</div>}
        </div>
      </div>
      <Modol title='Create channel' isOpen={modol} close={() => setModol(false)}>
        <form className='form channel-form' onSubmit={createChannel}>
            <input onChange={onChange} type="text" className='form-control' name='name' placeholder='please enter channel name'/>
            <input onChange={onChange} type="text" className='form-control' name='description' placeholder='please enter channel description'/>
            <input type="submit" className='submit-btn' value='create channel'/>
        </form>
      </Modol>
    </>
  )
}

export default Channels 