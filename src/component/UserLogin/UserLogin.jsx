import React,{useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../../App';
import Alert from '../Alert/Alert';
import './UserLogin.css'

const UserLogin = (props) => {
    const {authService} = useContext(UserContext)
    const [userLogins, setUserLogins] = useState({'email':'','password':''})
    const [error, setError] = useState(false)

    const onChange = ({target:{name, value}})=> {
        setUserLogins({...userLogins, [name]:value})
    }
    
    let navigation = useNavigate()
    const onLoginUser = (e) =>{
        e.preventDefault()
        const {email, password} = userLogins
        if(!!email && !!password){
            authService.loginUser(email, password)
            .then(()=> navigation('/chatApp'))
            .catch(error => {
                console.log('error ran')
                setError(true)
                setUserLogins({'email':'','password':''})
            })
        }
    }

    const errorMessage = 'Sorry you entered the incorrect email or password'
    return (
        <div className='center-display'>
            {error ? <Alert message={errorMessage} type='alert-danger'/> : null}
           <form onSubmit={onLoginUser} action="" className='form'>
               <label htmlFor="">Enter your <strong>email address </strong>
               and <strong>password</strong>
               </label>
               <input 
                    onChange={onChange} 
                    value={userLogins.email}
                    type="email" 
                    className='form-control' 
                    name='email' 
                    placeholder='username@gamil.com'/>
               <input 
                    onChange={onChange} 
                    value={userLogins.password}
                    type="password" 
                    className='form-control'
                    name='password' 
                    placeholder='enter your password'/>
               <input onChange={onChange} type="submit" className='submit-btn' value="Sign in"/>
           </form>
           <div className='footer-text'>
                No account ? Create one
                <Link to="/userCreate"> Here</Link>
           </div>
        </div>
    );
}

export default UserLogin;