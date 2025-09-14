import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from '../components/SignUp.jsx'
import SignIn from '../components/SignIn.jsx'
import DeleteUser from '../components/DeleteUser.jsx'

function App() {
  
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

  return (

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
  )
}

export default App
