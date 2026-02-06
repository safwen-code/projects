import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks.js'
import { login } from '../Reducer/auth/authSlice.js'

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
      sx={{
        position: 'fixed',
        inset: 0, // top: 0, right: 0, bottom: 0, left: 0
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: '#f5f5f5',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2} textAlign="center">
            Login
          </Typography>

          <TextField
            fullWidth
            label="Username"
            sx={{ mb: 2 }}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={(e) => {
              handleLogin(e)
            }}
          >
            Sign in
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
export default Login
