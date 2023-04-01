import { Box, IconButton, useTheme } from '@mui/material'
import { useContext } from 'react'
import { ColorModeContext } from '../../theme'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
const Topbar = () => {
	const theme = useTheme()
	const colorMode = useContext(ColorModeContext)

	return (
		<Box display='flex' justifyContent='space-between' p={2}>
			<Box display='flex'>
				<IconButton onClick={colorMode.toggleColorMode} size='large'>
					{theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
				</IconButton>
			</Box>
		</Box>
	)
}

export default Topbar
