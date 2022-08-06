import React from 'react'
//React, React Router, React Hooks
import { useNavigate } from 'react-router-dom'

// Pages
import { UserId } from '../UserId/UserId'
// import { UserId } from '../../Rules/'
import Referals from '../Submenu/Referals/referals'
import Statistics from '../Submenu/Statistics/statistics'

import HeaderLogo from '../../assets/headerLogo.png'
import HeaderHuman from '../../assets/HeaderHuman.png'
import Telegram from '../../assets/telegram.svg'
import LogOut from '../../assets/logout.svg'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { t } from 'ttag'
import { Lang } from '../MainPage/Lang/Lang'

const Header = () => {
	const [openUserInfo, setOpenUserInfo] = React.useState(false)
	const [openReferals, setOpenReferals] = React.useState(false)
	const [openStatistics, setOpenStatistics] = React.useState(false)
	const [openRules, setOpenRules] = React.useState(false)
	const params = useParams()
	const [onActive, setActive] = React.useState(true)
	const navigate = useNavigate()
	const [username, setUsername] = React.useState('')

	const [openBurger, setOpenBurger] = React.useState(false)
	const showUserInfo = () => {
		setOpenUserInfo(!openUserInfo)
		setOpenBurger(false)
		setOpenReferals(false)
		setOpenStatistics(false)
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
	const OpenMenu = () => {
		setOpenBurger(!openBurger)
		setOpenUserInfo(false)
		setOpenReferals(false)
		setOpenStatistics(false)
	}
	const handleLogout = () => {
		axios.get('/api/logout')
		localStorage.removeItem('token')
		navigate('/login')
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
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	return (
		<>
			<div className='main__header' ref={ref}>
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
								<a
									href='##'
									className='main__link'
									onClick={() => navigate('/home')}
								>
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
							<a
								className='main__block'
								href='https://t.me/Tokemon_game_Bot'
								target='__blank'
							>
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
			</div>
			<Lang
				setOpenBurger={setOpenBurger}
				setOpenUserInfo={setOpenUserInfo}
				setOpenReferals={setOpenReferals}
				setOpenStatistics={setOpenStatistics}
			/>
		</>
	)
}

export default Header
