import React, { useEffect, useState } from 'react'
import { PokeballsPack } from './PokeballsPack/PokeballsPack'
import { GameHistory } from './GameHistory/GameHistory'
import { IMAGES } from './PokeballsModal/PokeballsImages'
import bronze from '../../../assets/backgrounds/бронза фон.svg'
import silver from '../../../assets/backgrounds/серебро-min.svg'
import gold from '../../../assets/backgrounds/золото-min.svg'
import emerald from '../../../assets/backgrounds/изумруд-min.svg'
import { t } from 'ttag'
import axios from 'axios'
import Header from '../../Header/Header'
import { motion } from 'framer-motion'

const initialCardsAmount = {
	bronze: [0],
	silver: [0],
	gold: [0],
	emerald: [0],
}

const Game = () => {
	const [onActive, setActive] = useState(true)
	const [cardsAmount, setCardsAmount] = useState(initialCardsAmount)
	const [userMoney, setUserMoney] = useState('')

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
		oneq1: [0, 0, 0],
		two1: [0, 0, 0],
		the1: [0, 0, 0],
		oneq2: [0, 0, 0],
		two2: [0, 0, 0],
		the2: [0, 0, 0],
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
		setUserMoney(username.data.money)
	}
	let getHist = async () => {
		await axios.get('/api/get_hist_card').then(data => {
			const result = {
				oneq: data.data.oneq,
				two: data.data.two,
				the: data.data.the,
				oneq1: data.data.oneq1,
				two1: data.data.two1,
				the1: data.data.the1,
				oneq2: data.data.oneq2,
				two2: data.data.two2,
				the2: data.data.the2,
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
				<div className='homepage-wrapper'>
					<div className={onActive ? 'site-main-game' : 'site-main_active'}>
						<motion.div
							className='site-main-game-wrapper'
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: 'linear', delay: 0.3 }}
						>
							<div className='text-game'>{t`JOIN THE FIGHT AND WIN`}</div>
							<div className='container-pack-pokeballs'>
								<PokeballsPack
									title={t`BRONZE`}
									amount={cardsAmount.bronze}
									images={IMAGES.slice(0, 6)}
									background={bronze}
									card_data={card_data.bronze}
									price={price.bronze}
									six={six.bronze}
									money={userMoney}
								/>
								<PokeballsPack
									title={t`SILVER`}
									amount={cardsAmount.silver}
									images={IMAGES.slice(6, 12)}
									background={silver}
									card_data={card_data.silver}
									price={price.silver}
									six={six.silver}
									money={userMoney}
								/>
								<PokeballsPack
									title={t`GOLD`}
									amount={cardsAmount.gold}
									images={IMAGES.slice(12, 18)}
									background={gold}
									card_data={card_data.gold}
									price={price.gold}
									six={six.gold}
									money={userMoney}
								/>
								<PokeballsPack
									title={t`EMERALD`}
									amount={cardsAmount.emerald}
									images={IMAGES.slice(18, 24)}
									background={emerald}
									card_data={card_data.emerald}
									price={price.emerald}
									six={six.emerald}
									money={userMoney}
								/>
							</div>
							<GameHistory history={history} />
						</motion.div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Game
