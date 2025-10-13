import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TextField, Button, Paper, Typography, MenuItem } from '@mui/material'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen') // default citizen
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const u = await login(email, password, role)
      nav(u.role === 'admin' ? '/admin' : '/dashboard')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Paper className="p-4">
          <Typography variant="h5" className="mb-3">Login</Typography>
          <form onSubmit={submit}>
            <TextField 
              fullWidth 
              label="Email" 
              className="mb-3" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
            />
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              className="mb-3" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
            />
            <TextField
              select
              fullWidth
              label="Role"
              className="mb-3"
              value={role}
              onChange={e=>setRole(e.target.value)}
            >
              <MenuItem value="citizen">Citizen</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            {err && <div className="text-danger mb-2">{err}</div>}
            <Button type="submit" variant="contained" fullWidth>Login</Button>
          </form>
        </Paper>
      </div>
    </div>
  )
}
