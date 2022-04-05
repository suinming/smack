import React,{useState, useContext} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import Modol from '../Modol/Modol';
import {AVATARS_COUNT} from '../../constant.js'
import './UserCreate.css'
import { UserContext  } from '../../App';
import Alert from '../Alert/Alert';
import UserAvatar from '../UserAvatar/UserAvatar';

const UserCreate = (props) => {
    const {authService} = useContext(UserContext)
    const INIT_STATE = {
        userName:'',
        email:'',
        password:'',
        avatarName:'avatarDefault.png',
        avatarColor:'none',
    }
    const [userInfo, setUserInfo] = useState(INIT_STATE)
    const [modal, setModal] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    let navigate = useNavigate()

    const onChange = ({target:{name, value}})=> {
        setUserInfo({...userInfo, [name]:value})
    }

    const chooseAvatar = (avatar) =>{
        setUserInfo({...userInfo,avatarName:avatar})
        setModal(false)
    }

    const generateBGcolor = () =>{
        const randomColor = Math.floor(Math.random() * 16777215).toString(16)
        setUserInfo({...userInfo, avatarColor:`#${randomColor}`})
    }

    const createUser = (e) =>{
        e.preventDefault()
        setLoading(true)
        const {userName, email, password, avatarName, avatarColor} = userInfo
        if(!!userName && !!email && !!password){
            authService.registerUser(email, password).then(() => {
                console.log('register User')
                authService.loginUser(email, password).then(() => {
                    console.log('login User')
                    authService.createUser(userName, email, avatarName, avatarColor).then(() => {
                        console.log('create User')
                        setUserInfo(INIT_STATE)
                        // navigate to chat app
                        navigate('/chatApp')
                    }).catch(error => {
                        console.error('create user',error)
                        setError(true)
                    })
                }).catch(error => {
                        console.error('login user',error)
                        setError(true)
                })
            }).catch(error => {
                        console.error('register user',error)
                        setError(true)
            })
            setLoading(false)
        }
    }

    const {userName, email, password, avatarName, avatarColor} = userInfo
    const errorMessage = 'error creating account. Please try again'
    return (
        <>
            <div className='center-display'>
                {error ? <Alert message={errorMessage} type='alert-danger'/> : null}
                {loading ? <div> Loading ...</div> : null}
                <h3 className='title'>Create an account</h3>
                <form action="" className='form' onSubmit={createUser}>
                    <input type="text" onChange={onChange} value={userName} className='form-control' name='userName' placeholder='enter username'/>
                    <input type="text" onChange={onChange} value={email} className='form-control' name='email' placeholder='enter email'/>
                    <input type="text" onChange={onChange} value={password} className='form-control' name='password' placeholder='enter password'/>            
                    <div className='avatar-container'>
                        <UserAvatar avatar={{ avatarName, avatarColor }} className='create-avatar' />
                        <div className='avatar-text' onClick={() => setModal(true)} >Choose avatar</div>
                        <div className='avatar-text' onClick={generateBGcolor}>Generate background color</div>
                    </div>
                    <input className='submit-btn' type="submit" value='Create account'/>
                </form>
                <div className='footer-text'>Already have an account ? Login <Link to="/"> Here</Link></div>
            </div>
            <Modol 
            title={'Choose avatar'} 
            isOpen={modal} 
            close={() => setModal(false)}
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
        </>
    );
}


export default UserCreate;