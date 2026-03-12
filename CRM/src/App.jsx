import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './ui/Login'
import Product from './ui/Product'
import Invoice from './ui/Invoice'
import ProtectedRoute from './ui/ProtectedRoute'
import GlobalDrawer from './ui/GlobalDrawer'

const App = () => {
  const location = useLocation()
  const hideDrawer = location.pathname === '/login'
  return (
    <>
      <Routes>
        {/* login */}
        <Route path="/login" element={<Login />} />
        {/* products */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        {/* invoice */}
        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
      {!hideDrawer && <GlobalDrawer />}
    </>
  )
}

export default App
