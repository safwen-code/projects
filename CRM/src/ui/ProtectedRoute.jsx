import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.js'

export default function ProtectedRoute({ children }) {
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated)
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}
