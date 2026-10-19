import { useReducer } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import '../App.css'

const initialState = { username: '', password: '', message: '' }

function loginReducer(state, action) {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload }
    case 'SET_PASSWORD':
      return { ...state, password: action.payload }
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    default:
      return state
  }
}

function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState)
  const { username, password, message } = state
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Please enter both username and password.' })
      return
    }

    if (username === 'admin' && password === 'password') {
      login(username)
      navigate('/welcome', { replace: true })
    } else {
      dispatch({ type: 'SET_MESSAGE', payload: 'Invalid username or password. Try admin / password.' })
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <p className="subtitle">Sign in to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) => dispatch({ type: 'SET_USERNAME', payload: event.target.value })}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => dispatch({ type: 'SET_PASSWORD', payload: event.target.value })}
          />

          <button type="submit">Login</button>
        </form>

        {message ? <p className="status error">{message}</p> : null}
      </div>
    </div>
  )
}

export default Login
