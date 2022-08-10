import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MainBg from '../../assets/MainBg.jpg'
import { Lang } from '../Lang/Lang'
import Pokebol from '../../assets/pockebol.png'
import PokebolRu from '../../assets/pockebol-ru.png'
import PokebolIt from '../../assets/pockebol-it.png'
import PokebolEs from '../../assets/pockebol-es.png'
import PokebolPt from '../../assets/pockebol-pt.png'
import PokebolFr from '../../assets/pockebol-fr.png'
import Logo from '../../assets/header/logo.svg'
import * as cookie from '../../cookie'
let data2

try {
	axios.get('/api/login').catch(function (error) {
		if (error.response) {
			data2 = error.response.status
		}
	})
} catch (error) {}
const LOCALE_COOKIE = '__locale'


const Startgame = () => {
	const [activeImg, setActiveImg] = React.useState()
	const navigate = useNavigate()
	const startGame = () => {
		console.log(1)
		if (data2 === 501) {
			navigate('/home')
		} else {
			navigate('/login')
		}
	}
	React.useEffect(() => {
		switch (cookie.get(LOCALE_COOKIE) || 'en') {
			case 'de': {
				setActiveImg([
					<img
						onClick={startGame}
						src={Pokebol}
						alt=''
						className='logo-pokebol'
					/>,
				])
				break
			}
			case 'pt': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolPt}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			case 'it': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolIt}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			case 'es': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolEs}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			case 'fr': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolFr}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			case 'ar': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolEs}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			case 'br': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolPt}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			case 'ru': {
				setActiveImg(
					<img
						onClick={startGame}
						src={PokebolRu}
						alt=''
						className='logo-pokebol'
					/>
				)
				break
			}
			default: {
				setActiveImg(
					<img
						onClick={startGame}
						src={Pokebol}
						alt=''
						className='logo-pokebol'
					/>,
				)
			}
		}
	}, [])
	console.log(activeImg)
	const [onActive, setActive] = React.useState(true)
	return (
		<div className='background-start'>
			<img src={Logo} className='logo-tokemon' alt='' />
			{activeImg}
			<img src={MainBg} alt='' className='main-bg' />
			<Lang isActive={onActive} />
		</div>
	)
}

export default Startgame
