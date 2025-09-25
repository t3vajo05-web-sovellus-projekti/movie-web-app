import React, { useEffect, useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import MyRecentReviews from '../components/myRecentReviews'

export default function MyProfile() {
    const [userData, setUserData] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
      if (!user) return;

      fetch("http://localhost:3001/users/me", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error(err));
  }, [user]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className='container py-5'>
      <h1>My Profile</h1>

      <p><strong>Username:</strong> {userData.username}</p>
      
      <MyRecentReviews userId={userData.id} />
      
      My Groups

      My watchlist
    </div>
  );
}
