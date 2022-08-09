import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login/login'
import StartGame from './components/StartGame/startgame'
import Game from './components/Submenu/Game/game'
import Pay from './components/Pay/Pay'
import Deposit from './components/Deposit/Deposit'
import Rules from './components/Rules/Rules'
import Resetpass from './components/ResetPass/Resetpass'
import { loadReCaptcha } from 'recaptcha-v3-react-function-async'
import { get } from './cookie'
function App() {
	console.log(get('utm'))
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
			<Route path='/home/rules' element={<Rules />} />
			<Route path='/reset/:uid/:token' element={<Resetpass />} />
		</Routes>
	)
}
export default App
