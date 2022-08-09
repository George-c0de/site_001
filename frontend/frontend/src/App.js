import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login/login'
import StartGame from './components/StartGame/startgame'
import Game from './components/Submenu/Game/game'
import Pay from './components/Pay/Pay'
import Deposit from './components/Deposit/Deposit'
import Rules from './components/Rules/Rules'
import Resetpass from './components/ResetPass/Resetpass'
function App() {
	return (
		<Routes>
			<Route path='/' element={<StartGame />} />
			<Route path='/home' element={<Game />} />
			<Route path='/login/:utm' element={<Login />} />
			<Route path='/login' element={<Login />} />
			<Route path='/home/pay' element={<Pay />} />
			<Route path='/home/deposit' element={<Deposit />} />
			<Route path='/home/rules' element={<Rules />} />
			<Route path='/reset/:uid/:token' element={<Resetpass />} />
		</Routes>
	)
}
export default App
