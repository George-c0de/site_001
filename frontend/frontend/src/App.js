import { Route, Routes } from 'react-router-dom'
import MainPage from './components/MainPage/mainpage'
import Signup from './components/Signup/signup'
import Login from './components/Login/login'
import UpdateUser from './components/UpdateUser/updateuser'
import StartGame from './components/StartGame/startgame'
import Statistics from './components/Submenu/Statistics/statistics.jsx'
import Referals from './components/Submenu/Referals/referals'
import Game from './components/Submenu/Game/game'
import Pay from './components/Pay/Pay'
import Deposit from './components/Deposit/Deposit'
import React from 'react'
import Rules2 from './components/Rules2/Rules2'

function App() {
	//const user=localStorage.getItem("token");
	// React.useEffect(() => {
	// 	loadReCaptcha('6LfvLEkhAAAAAHfamR736TVtumYAmll0Kiy1iqmD')
	// 		.then(() => {
	// 			console.log('ReCaptcha loaded')
	// 		})
	// 		.catch(e => {
	// 			console.error('Error when load ReCaptcha', e)
	// 		})
	// }, [])

	return (
		<Routes>
			<Route path='/' exact element={<StartGame />} />
			<Route path='/home' exact element={<Game />} />
			<Route path='/login' exact element={<Login />} />
			<Route path='/home/pay' exact element={<Pay />} />
			<Route path='/home/deposit' exact element={<Deposit />} />
			<Route path='/' exact element={<Deposit />} />
			{/* <Route path='/update/:id' exact element={<UpdateUser />} /> */}
			<Route path='/home/rules' element={<Rules2 />} />
		</Routes>
	)
}
export default App
