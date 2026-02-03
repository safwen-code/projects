import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useAppDispatch } from '../app/hooks.js'
import { login } from '../Reducer/auth/authSlice.js'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('1234')
  const dispatch = useAppDispatch()
  const nav = useNavigate()

  const handleLogin = () => {
    // fake auth
    if (username && password) {
      dispatch(login({ username }))
      nav('/products')
    }
  }

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}
    >
      <Card sx={{ width: 420, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button fullWidth variant="contained" onClick={handleLogin}>
            Sign in
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
export default Login
