import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MainBg from '../../assets/MainBg.png'
import { Lang } from '../Lang/Lang'
let data2
try {
	axios.get('/api/login').catch(function (error) {
		if (error.response) {
			data2 = error.response.status
		}
	})
} catch (error) {}
const Startgame = () => {
	const navigate = useNavigate()
	const startGame = () => {
		console.log(1)
		if (data2 === 501) {
			navigate('/home')
		} else {
			navigate('/login')
		}
	}
	const [onActive, setActive] = React.useState(true)
	return (
		<div className='background-start'>
			<p href="##" onClick={startGame} className='start-link'>
			</p>
			<img src={MainBg} alt='' className='main-bg' />
			<Lang isActive={onActive} />
		</div>
	)
}

export default Startgame
