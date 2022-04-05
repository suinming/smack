import React, { useState, createContext, useContext } from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import ChatApp from './component/ChatApp/ChatApp';
import UserCreate from './component/UserCreate/UserCreate';
import UserLogin from './component/UserLogin/UserLogin';
import { AuthService } from './services';

const authService = new AuthService()

export const UserContext = createContext()
const AuthProvider = ({ children }) => {
  const context = {
    authService,
    // message service
    appSelectedChannel: {},
    appSetChannel: (ch) => {
      setAuthContext({ ...authContext, appSelectedChannel: ch })
    }
    // update message service
  }
  const [authContext, setAuthContext] = useState(context)

  return (
    <UserContext.Provider value={authContext}>
      {children}
    </UserContext.Provider>
  )
}

const PrivateRoute = ({ children, ...props }) => {
  const context = useContext(UserContext)
  //let navigate = useNavigate()
  let location = useLocation();
  if (!context.authService.isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />
    //navigate('/')
  }
  return children
}

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<UserLogin />} />
            <Route path='/userCreate' element={<UserCreate />} />
            <Route path='/chatApp'
              element={<PrivateRoute>
                <ChatApp />
              </PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;


