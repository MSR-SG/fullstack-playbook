import { createContext, useContext, useReducer } from 'react'

const AuthContext = createContext(null)

const initialState = { loggedInUser: '' }

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, loggedInUser: action.payload }
    case 'LOGOUT':
      return { ...state, loggedInUser: '' }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (username) => dispatch({ type: 'LOGIN_SUCCESS', payload: username })
  const logout = () => dispatch({ type: 'LOGOUT' })

  return (
    <AuthContext.Provider value={{ loggedInUser: state.loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
