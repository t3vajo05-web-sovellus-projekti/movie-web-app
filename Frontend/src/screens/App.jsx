import { useState } from 'react'
import '../App.css'
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
