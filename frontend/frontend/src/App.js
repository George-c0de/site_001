import { Route, Routes } from 'react-router-dom'
import Login from './components/Login/login'
import StartGame from './components/StartGame/startgame'
import Game from './components/Submenu/Game/game'
import Pay from './components/Pay/Pay'
import Deposit from './components/Deposit/Deposit'
import React from 'react'
import Rules2 from './components/Rules2/Rules2'
import Resetpass from './components/ResetPass/Resetpass'
import { loadReCaptcha } from 'recaptcha-v3-react-function-async'

function App() {
	React.useEffect(() => {
		loadReCaptcha('6LfvLEkhAAAAAHfamR736TVtumYAmll0Kiy1iqmD')
			.then(() => {
				console.log('ReCaptcha loaded')
			})
			.catch(e => {
				console.error('Error when load ReCaptcha', e)
			})
	}, [])

	return (
		<Routes>
			<Route path='/' exact element={<StartGame />} />
			<Route path='/home' exact element={<Game />} />
			<Route path='/login' exact element={<Login />} />
			<Route path='/home/pay' exact element={<Pay />} />
			<Route path='/home/deposit' exact element={<Deposit />} />
			<Route path='/' exact element={<Deposit />} />
			<Route path='/home/rules' element={<Rules2 />} />
			<Route path='/reset' element={<Resetpass />} />
		</Routes>
	)
}
export default App
