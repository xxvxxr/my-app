/** @jsxRuntime classic */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material'
import { themeSettings } from '../theme.js'

const Login = ({ onSuccess }) => {
	const [state, setState] = useState({
		email: '',
		password: ''
	})
	const [email, setEmail] = useState(state.email)
	const [password, setPassword] = useState(state.password)
	const [error, setError] = useState('')
	const history = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const response = await axios.post('/login', { email, password })
			localStorage.setItem('token', response.data.token)
			onSuccess() // call the callback function
			history.push('/')
		} catch (err) {
			setError('Invalid email or password')
			console.log(err.response)
		}
	}

	const theme = createTheme(themeSettings('light'))

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh'
					}}
				>
					<Container maxWidth='sm'>
						<Box sx={{ mb: 4 }}>
							<Typography variant='h4' align='center'>
								Login to use Calculator
							</Typography>
						</Box>
						<Box component='form' onSubmit={handleSubmit}>
							<Box sx={{ mb: 2 }}>
								<TextField
									fullWidth
									label='Email'
									variant='outlined'
									value={email}
									onChange={(event) => setEmail(event.target.value)}
								/>
							</Box>
							<Box sx={{ mb: 2 }}>
								<TextField
									fullWidth
									label='Password'
									type='password'
									variant='outlined'
									value={password}
									onChange={(event) => setPassword(event.target.value)}
								/>
							</Box>
							<Button type='submit' variant='contained' fullWidth>
								Login
							</Button>
						</Box>
					</Container>
				</Box>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default Login
