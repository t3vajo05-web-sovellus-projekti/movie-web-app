import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import SignUp from '../components/SignUp.jsx'
import SignIn from '../components/SignIn.jsx'
import DeleteUser from '../components/DeleteUser.jsx'
import { useUser } from '../context/useUser.js'

function App() {
  /*
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [view, setView] = useState('signup')

  const saveToken = (newToken) => {
    if(newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    setToken(newToken)
  }

  const logout = () => {
    saveToken(null)
  }
  */

  const { user, logout } = useUser()

  return (
    /*
    <div>
      {!token ? (
        <>
          <div>
            <button onClick={() => setView('signin')}>Sign in</button>
            <button onClick={() => setView('signup')}>Sign up</button>
          </div>
          {view === 'signin' && <SignIn setToken={saveToken} />}
          {view === 'signup' && <SignUp />}
        </>
      ) : (
        <>
          <DeleteUser token={token} setToken={saveToken} />
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
    */

    <div>
      {user && user.token ? (
        <>
          <h2>Welcome, {user.username}!</h2>
          <DeleteUser />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h2>Please sign in</h2>
      )}
    </div>
  )
}

export default App
