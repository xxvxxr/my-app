/** @jsxRuntime classic */

import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Topbar from './scenes/global/Topbar.jsx'
import Sidebar from './scenes/global/Sidebar.jsx'
import Dashboard from './scenes/dashboard/index.jsx'
import Login from './scenes/login.js'
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material'
import { ColorModeContext, useMode } from './theme.js'

function App() {
	const [theme, colorMode] = useMode()
	const [isSidebar, setIsSidebar] = useState(true)
	const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'))

	const handleLogin = () => {
		setLoggedIn(true)
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		setLoggedIn(false)
	}

	return (
		<ColorModeContext.Provider value={colorMode}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{loggedIn ? (
						<div className='app'>
							<Sidebar isSidebar={isSidebar} />
							<main className='content'>
								<Topbar setIsSidebar={setIsSidebar} onLogout={handleLogout} />
								<Routes>
									<Route path='/' element={<Dashboard />} />
								</Routes>
							</main>
						</div>
					) : (
						((<Login onLogin={handleLogin} />), console.log('not logged in', loggedIn))
					)}
				</ThemeProvider>
			</StyledEngineProvider>
		</ColorModeContext.Provider>
	)
}

export default App
