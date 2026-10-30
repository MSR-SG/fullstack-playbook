import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import '../App.css'

function WelcomeMember() {
  const { loggedInUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{loggedInUser}</h1>
        <p className="status success">Welcome member</p>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default WelcomeMember
