import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserId } from '../UserId/UserId'
import Referals from '../Submenu/Referals/referals'
import Statistics from '../Submenu/Statistics/statistics'
import HeaderLogo from '../../assets/header/logo.svg'
import HeaderHuman from '../../assets/HeaderHuman.png'
import Telegram from '../../assets/telegram.svg'
import LogOut from '../../assets/logout.svg'
import axios from 'axios'
import { t } from 'ttag'
import { Lang } from '../Lang/Lang'
import { motion } from 'framer-motion'

let data2

try {
	axios.get('/api/login').catch(function (error) {
		if (error.response) {
			data2 = error.response.status
		}
	})
} catch (error) {}

const Header = () => {
	const [openUserInfo, setOpenUserInfo] = React.useState(false)
	const [openReferals, setOpenReferals] = React.useState(false)
	const [openStatistics, setOpenStatistics] = React.useState(false)

	const navigate = useNavigate()

	const startGame = () => {
		if (data2 !== 501) {
			navigate('/login')
		}
	}

	const [openBurger, setOpenBurger] = React.useState(false)
	const showUserInfo = () => {
		setOpenUserInfo(!openUserInfo)
		setOpenBurger(false)
		setOpenReferals(false)
		setOpenStatistics(false)
		startGame()
	}
	const showReferals = () => {
		setOpenReferals(true)
		setOpenBurger(false)
		setOpenStatistics(false)
	}
	const showStatistics = () => {
		setOpenStatistics(true)
		setOpenBurger(false)
		setOpenReferals(false)
	}
	const showMenu = () => {
		setOpenBurger(false)
		navigate('/home')
	}
	const OpenMenu = () => {
		setOpenBurger(!openBurger)
		setOpenUserInfo(false)
		setOpenReferals(false)
		setOpenStatistics(false)
		startGame()
	}

	const handleLogout = () => {
		axios.get('/api/logout')
		localStorage.removeItem('token')
		document.cookie =
			'openTg' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
		window.location.assign(`${window.location.origin}/login`)
	}
	const ref = React.useRef(null)

	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOpenBurger(false)
			setOpenUserInfo(false)
			setOpenReferals(false)
			setOpenStatistics(false)
		}
	}

	React.useEffect(() => {
		fetchLink()
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	const [get_link_tg, setget_link_tg] = React.useState({
		link_tg: 'https://t.me/Tokemon_game_Bot',
	})

	async function fetchLink() {
		try {
			const response = await axios.get('/api/get_link_tg')
			setget_link_tg(response.data.link_tg)
		} catch (e) {
			if (e.response.status !== 200) {
				let data_ = 'https://t.me/Tokemon_game_Bot'
				setget_link_tg(data_)
			}
		}
	}

	return (
		<>
			<motion.div
				className='main__header'
				ref={ref}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, ease: 'linear' }}
			>
				<nav className='main__nav'>
					<div
						className={`main__menu menu-btn ${openBurger ? 'open' : ''} `}
						onClick={OpenMenu}
					>
						<div className='menu-btn__burger'></div>
					</div>
					<img src={HeaderLogo} alt='Logo' className='main-logo' />
					<img
						src={HeaderHuman}
						alt='User'
						className='main-img'
						onClick={showUserInfo}
					/>
				</nav>
				{openBurger && (
					<div className='main__links'>
						<ul className='main__list'>
							<li className='main__item'>
								<a href='##' className='main__link' onClick={showMenu}>
									{t`MAIN`}
								</a>
							</li>
							<li className='main__item'>
								<a href='##' className='main__link' onClick={showReferals}>
									{t`REFFERALS`}
								</a>
							</li>
							<li className='main__item'>
								<a href='##' className='main__link' onClick={showStatistics}>
									{t`STATISTICS`}
								</a>
							</li>
							<li className='main__item'>
								<a
									href='##'
									className='main__link'
									onClick={() => navigate('/home/rules')}
								>
									{t`RULES`}
								</a>
							</li>
						</ul>
						<div className='main__blocks'>
							<a className='main__block' href={get_link_tg} target='__blank'>
								<img src={Telegram} alt='' />
								<p className='main__text'>{t`USE TELEGRAM BOT`}</p>
							</a>
							<p className='main__block' onClick={handleLogout}>
								<img src={LogOut} alt='' />
								<p className='main__text'>{t`LOGOUT`}</p>
							</p>
						</div>
					</div>
				)}

				{openUserInfo && <UserId />}
				{openReferals && <Referals />}
				{openStatistics && <Statistics />}
				<Lang
					setOpenBurger={setOpenBurger}
					setOpenUserInfo={setOpenUserInfo}
					setOpenReferals={setOpenReferals}
					setOpenStatistics={setOpenStatistics}
				/>
			</motion.div>
		</>
	)
}

export default Header
