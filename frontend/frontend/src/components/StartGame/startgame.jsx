import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MainBg from '../../assets/MainBg.jpg'
import { Lang } from '../Lang/Lang'
import Pokebol from '../../assets/pockebol.png'
import Logo from '../../assets/header/logo.svg'
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
			<img src={Logo} className='logo-tokemon' alt='' />
			<img onClick={startGame} src={Pokebol} alt=""  className='logo-pokebol'/>
			<img src={MainBg} alt='' className='main-bg' />
			<Lang isActive={onActive} />
		</div>
	)
}

export default Startgame
