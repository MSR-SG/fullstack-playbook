import { Routes, Route, Navigate, Outlet } from 'react-router'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './components/Login.jsx'
import WelcomeMember from './components/WelcomeMember.jsx'

function RootRedirect() {
  const { loggedInUser } = useAuth()
  return <Navigate to={loggedInUser ? '/welcome' : '/login'} replace />
}

function ProtectedRoute() {
  const { loggedInUser } = useAuth()
  return loggedInUser ? <Outlet /> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<RootRedirect />} />
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="welcome" element={<WelcomeMember />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
