import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import SignUp from '../components/SignUp.jsx'
import SignIn from '../components/SignIn.jsx'
import DeleteUser from '../components/DeleteUser.jsx'
import TheatreBrowser from '../components/BrowseEvents.jsx'
import { useUser } from '../context/useUser.js'

function App() {

  const [view, setView] = useState('signup')


  const { user, logout } = useUser()

  return (

    <div>
      {user && user.token ? (
        <>
          <h2>Welcome, {user.username}!</h2>
          <DeleteUser />
          <button onClick={logout}>Logout</button>
          <button onClick={() => setView('finnkino')}>Browse Shows</button>
          {view === 'finnkino' && <TheatreBrowser />}
        </>
      ) : (
        <h2>Please sign in</h2>
      )}
    </div>
  )
}

export default App
