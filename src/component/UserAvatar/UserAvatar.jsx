import React, {useContext} from 'react'
import { UserContext } from '../../App'
import PropTypes from 'prop-types'
import './UserAvatar.css'

const UserAvatar = ({avatar,className, size}) => {
  const {authService} = useContext(UserContext)
  const {avatarName, avatarColor} = avatar
  return(
    <img 
    className={`avatar-icon ${className} ${size}`}
    style={{backgroundColor: avatarColor || authService.avatarColor}} 
    src={ avatarName || authService.avatarName} 
    alt="avatar" />
  )
}

UserAvatar.propTypes = {
  avatar:PropTypes.object,
  className:PropTypes.string,
  size:PropTypes.string,
}

UserAvatar.defaultProps = {
  avatar:{},
  className:'',
  size:'lg',
}

export default UserAvatar