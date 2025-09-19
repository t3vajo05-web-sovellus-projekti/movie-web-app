import { useState } from 'react'
import '../App.css'
import { Routes, Route } from 'react-router-dom'
import DeleteUser from '../components/DeleteUser.jsx'
import TheatreBrowser from '../components/BrowseEvents.jsx'
import { useUser } from '../context/useUser.js'

/* Components imports */
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

/* Pages imports */
import Home from '../pages/Home.jsx'
import BrowseShows from '../pages/BrowseShows.jsx'
import NotFound from '../pages/NotFound.jsx'
import Explore from '../pages/Explore.jsx'
import Groups from '../pages/Groups.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Moviesearch from '../pages/Moviesearch.jsx'
import UserProvider from '../context/userProvider.jsx'
import Movie from '../pages/Movie.jsx'

/*
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
*/

function App() {

  return (
    <>
    <UserProvider>
      <Navbar />
      <Header />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/browseshows" exact element={<BrowseShows />} />
          <Route path="/explore" exact element={<Explore />} />
          <Route path="/groups" exact element={<Groups />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/moviesearch" exact element={<Moviesearch />} />
          <Route path="/movie/:id" exact element={<Movie />} />

          <Route path="/*" exact element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      </UserProvider>
    </>
  )
}

export default App