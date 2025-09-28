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
import MyProfile from '../pages/MyProfile.jsx'
import MyAccount from '../pages/MyAccount.jsx'
import Movie from '../pages/Movie.jsx'
import MyWatchlist from '../pages/MyWatchlist.jsx'
import PublicWatchlist from '../pages/publicWatchlist.jsx'


function App() {

  return (
    <>
    <UserProvider>
      <Navbar />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/browseshows" exact element={<BrowseShows />} />
          <Route path="/explore" exact element={<Explore />} />
          <Route path="/groups" exact element={<Groups />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/moviesearch" exact element={<Moviesearch />} />
          <Route path="/myprofile" exact element={<MyProfile />} />
          <Route path="/myaccount" exact element={<MyAccount />} />
          <Route path="/movie/:id" exact element={<Movie />} />
          <Route path="/watchlist" exact element={<MyWatchlist />} />
          <Route path="/watchlist/user/:id" exact element={<PublicWatchlist />} />
          <Route path="/*" exact element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      </UserProvider>
    </>
  )
}

export default App