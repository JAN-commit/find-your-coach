import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'

import AppShell from './layouts/AppShell'
import HomePage from './Pages/HomePage'
import Dashboard from './Pages/Dashboard'
import Coaches from './Pages/Coaches'
import CoachDetails from './Pages/CoachDetails'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import CoachRegistration from './Pages/CoachRegistration'
import MessageRequest from './Pages/MessageRequest'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RequireAuth({ children }) {
  const location = useLocation();
  const isAuthed = !!localStorage.getItem('idToken');

  if (!isAuthed) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }
  return children;
}

function HomeRedirect() {
  const isAuthed = !!localStorage.getItem('idToken');
  return isAuthed ? <Navigate to="/dashboard" replace /> : <HomePage />;
}

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path='/' element={<HomeRedirect />} />
          <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/Coaches' element={<RequireAuth><Coaches /></RequireAuth>} />
          <Route path='/CoachDetails/:id' element={<CoachDetails />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Signup' element={<Signup />} />
          <Route
            path='/CoachRegistration'
            element={
              <RequireAuth>
                <CoachRegistration />
              </RequireAuth>
            }
          />
          <Route
            path='/MessageRequest'
            element={
              <RequireAuth>
                <MessageRequest />
              </RequireAuth>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AppShell>
      <ToastContainer />
    </Router>
  )
}

export default App