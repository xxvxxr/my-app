import { Box, useTheme } from '@mui/material'
import { tokens } from '../../theme'
import Header from '../../components/Header'
import Calculator from '../../components/Calculator.tsx/App'

const Dashboard = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	return (
		<Box m='20px'>
			{/* HEADER */}
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<Header title='DASHBOARD' />
			</Box>

			{/* GRID & CHARTS */}
			<Box
				display='grid'
				gridTemplateColumns='repeat(12, 1fr)'
				gridAutoRows='140px'
				gap='20px'
			>
				{/* ROW 2 */}
				<Box gridColumn='span 10' gridRow='span 3' backgroundColor={colors.primary[400]}>
					<Calculator />
				</Box>
			</Box>
		</Box>
	)
}

export default Dashboard
