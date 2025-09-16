import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './screens/App.jsx'
import UserProvider from './context/userProvider.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Authentication, { AuthenticationMode } from './screens/Authentication.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFound from './screens/NotFound.jsx'

/*
const router = createBrowserRouter([
  { errorElement: <NotFound /> },
  { path: "/signin", element: <Authentication authenticationMode={AuthenticationMode.SignIn} /> },
  { path: "/signup", element: <Authentication authenticationMode={AuthenticationMode.SignUp} /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <App /> }]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
*/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)