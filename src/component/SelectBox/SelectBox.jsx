import React,{useContext, useEffect, useRef} from 'react'
import './SelectBox.css'
import { UserContext } from '../../App'

// action = {target:message or channel , id:message.id or channel.id}

const SelectBox =({action, showModol, onClickOutside }) => {
    const ref = useRef(null);
    const {chatService, appSelectedChannel} = useContext(UserContext)

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside && onClickOutside();
        }
      };
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }, [ onClickOutside ]);

    const deleteAction = ({target, id})=>{
      switch (target) {
        case 'message':
          chatService.deleteMessage(id)
          showModol('')
          break;
        case 'channel':
          chatService.deleteChannel(id)
          showModol('')
          break;
        default:
          break;
      }
    }

    return(
      <ul className='selectBox' ref={ref}>
        <li onClick={() => deleteAction(action)}>delete</li>
      </ul>
    )
}


export default SelectBox