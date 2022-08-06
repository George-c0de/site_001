//React, React Router, React Hooks
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Pages
import { Lang } from '../../MainPage/Lang/Lang'
import { Menu } from '../../MainPage/Menu/Menu'
import { UserId } from '../../UserId/UserId'
// import { UserId } from '../../Rules/'
import Referals from '../Referals/referals'
import Statistics from '../Statistics/statistics'

import { PokeballsPack } from './PokeballsPack/PokeballsPack'
import { GameHistory } from './GameHistory/GameHistory'
//Images
import { IMAGES } from './PokeballsModal/PokeballsImages'
import bronze from '../../../assets/backgrounds/бронза фон.svg'
import silver from '../../../assets/backgrounds/серебро-min.svg'
import gold from '../../../assets/backgrounds/золото-min.svg'
import emerald from '../../../assets/backgrounds/изумруд-min.svg'
import HeaderLogo from '../../../assets/headerLogo.png'
import HeaderHuman from '../../../assets/HeaderHuman.png'
import Telegram from '../../../assets/telegram.svg'
import LogOut from '../../../assets/logout.svg'

import { t } from 'ttag'
import axios from 'axios'
import { loadReCaptcha } from 'recaptcha-v3-react-function-async'
import Header from '../../Header/Header'
import SubscribeTg from '../../modals/SubscribeTg'

const initialCardsAmount = {
	bronze: [0],
	silver: [0],
	gold: [0],
	emerald: [0],
}

const Game = () => {
	const [onActive, setActive] = useState(true)
	const [cardsAmount, setCardsAmount] = useState(initialCardsAmount)
	const [username, setUsername] = useState('')

	const [openBurger, setOpenBurger] = useState(false)

	const [price, setPrice] = useState({
		bronze: [10, 15, 25, 40, 50, 77],
		silver: [100, 150, 250, 400, 500, 666],
		gold: [750, 1000, 1250, 1500, 2000, 2222],
		emerald: [2500, 5000, 7500, 10000, 15000, 22222],
	})
	const [history, setHistory] = useState({
		oneq: [0, 0, 0],
		two: [0, 0, 0],
		the: [0, 0, 0],
	})

	const [card_data, setCard_data] = useState({
		bronze: [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		],
		silver: [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		],
		gold: [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		],
		emerald: [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		],
	})

	const [six, setsix] = useState({
		bronze: false,
		silver: false,
		gold: false,
		emerald: false,
	})
	const getSix = async () => {
		await axios.get('/api/six').then(data => {
			const result = {
				bronze: data.data.bronze,
				silver: data.data.silver,
				gold: data.data.gold,
				emerald: data.data.emerald,
			}

			setsix(result)
		})
	}
	const getCard = async () => {
		await axios.get('/api/get_user_in_matrix').then(data => {
			const result = {
				bronze: data.data.bronze,
				silver: data.data.silver,
				gold: data.data.gold,
				emerald: data.data.emerald,
			}

			setCardsAmount(result)
		})
	}

	useEffect(() => {
		getCard()
		getUsername()
		getCard_data()
		getHist()
		getSix()
	}, [])

	let getUsername = async () => {
		const username = await axios.get('/api/user')
		setUsername(username.data.username)
	}
	let getHist = async () => {
		await axios.get('/api/get_hist_card').then(data => {
			const result = {
				oneq: data.data.oneq,
				two: data.data.two,
				the: data.data.the,
			}
			setHistory(result)
		})
	}
	let getCard_data = async () => {
		await axios.get('/api/get_user_in_card').then(data => {
			const result = {
				bronze: data.data.bronze,
				silver: data.data.silver,
				gold: data.data.gold,
				emerald: data.data.emerald,
			}
			setCard_data(result)
		})
	}

	return (
		<>
			<div className='main_container'>
				<Header />
				{/*<h1>{ username }</h1>*/}
				<div className='homepage-wrapper'>
					<div className={onActive ? 'site-main-game' : 'site-main_active'}>
						<div className='site-main-game-wrapper'>
							<div className='text-game'>{t`JOIN THE FIGHT AND WIN`}</div>

							<div className='container-pack-pokeballs'>
								<PokeballsPack
									title={'BRONZE'}
									amount={cardsAmount.bronze}
									images={IMAGES.slice(0, 6)}
									background={bronze}
									card_data={card_data.bronze}
									price={price.bronze}
									six={six.bronze}
								/>
								<PokeballsPack
									title={'SILVER'}
									amount={cardsAmount.silver}
									images={IMAGES.slice(6, 12)}
									background={silver}
									card_data={card_data.silver}
									price={price.silver}
									six={six.silver}
								/>
								<PokeballsPack
									title={'GOLD'}
									amount={cardsAmount.gold}
									images={IMAGES.slice(12, 18)}
									background={gold}
									card_data={card_data.gold}
									price={price.gold}
									six={six.gold}
								/>
								<PokeballsPack
									title={'EMERALD'}
									amount={cardsAmount.emerald}
									images={IMAGES.slice(18, 24)}
									background={emerald}
									card_data={card_data.emerald}
									price={price.emerald}
									six={six.emerald}
								/>
							</div>
							<GameHistory history={history} />
						</div>
					</div>
				</div>
			</div>
			<SubscribeTg />
		</>
	)
}
export default Game
