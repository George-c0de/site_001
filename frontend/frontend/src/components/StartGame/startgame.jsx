import React from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from 'ttag'
// Images
import Logo from '../../Ảnh Pokemon Dự Trù/логотип.svg'
import axios from 'axios'
import MainBg from '../../assets/MainBg.jpg'
import { Lang } from '../MainPage/Lang/Lang'
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
			<img src={MainBg} alt='' className='main-bg' />
			<p className='start-game' onClick={startGame}>
				{t`start`}
			</p>
			<Lang isActive={onActive} />
		</div>
	)
}

export default Startgame
