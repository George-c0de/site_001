import React, { useEffect, useState } from 'react'
import axios from 'axios'

import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import q from '../../../../Ảnh Pokemon Dự Trù/Знак вопроса.svg'
import './PokeballsModal.css'
import BuyPockebol from '../../../modals/BuyPockebol'
import { t } from 'ttag'
import NotEnoughMoney from '../../../modals/NotEnoughMoney'
import BuyPockebolInner from '../../../modals/buyPockebolInner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../../redux/slices/userSlice'
import { getUser } from '../../../redux/slices/selectors'

const CardOpened = ({
	image,
	buyCard,
	background,
	card_data,
	idCard,
	category,
	price,
	dataId,
	id,
}) => {
	let status = card_data[0]
	const [disabledBtn, setDisabledBtn] = useState(true)
	// const [activeCategory, setActiveCategory] = useState(false)
	const handleButton = async () => {
		console.log(category)
		await axios.get(`/api/prohibitions`).then(res => {
			let data = res.data
			console.log(data)
			switch (category) {
				case 'bronze': {
					setDisabledBtn(data.bronze[idCard - 1])
					// setActiveCategory('bronze')
					break
				}
				case 'silver': {
					setDisabledBtn(data.silver[idCard - 1])
					// setActiveCategory('silver')
					break
				}
				case 'gold': {
					setDisabledBtn(data.gold[idCard - 1])
					// setActiveCategory('gold')
					break
				}
				case 'emerald': {
					setDisabledBtn(data.emerald[idCard - 1])
					// setActiveCategory('emerald')
					break
				}
			}
		})
	}

	const dispatch = useDispatch()
	const { user } = useSelector(getUser)
	let money = user.money

	async function fetchPosts() {
		console.log('UPDATE USER')
		try {
			const response = await axios.get('/api/user')
			dispatch(setUser(response.data))
		} catch (e) {}
	}

	useEffect(() => {
		handleButton()
	}, [])

	// const [openMenu, setOpenMenu] = useState(false)
	// const [answer, setAnswer] = useState(false)

	const [accept2, setAccept2] = useState()
	const [purchaseConfirmation2, setPurchaseConfirmation2] = useState()
	const [firstRender2, setFirstRender2] = useState(false)
	const [hideModal2, setHideModal2] = React.useState(false)

	const handleBuyClick2 = async (props, props2) => {
		if (!props2 && disabledBtn) {
			setAccept2(true)
		}
		console.log(purchaseConfirmation2, disabledBtn)
		if (disabledBtn && purchaseConfirmation2 && price <= money) {
			setPurchaseConfirmation2(false)
			console.log(category, idCard)
			// setTimeout(async () => {
			await axios.get(`/api/${category}/${idCard}`).then(res => {
				// setTimeout(() => {
				fetchPosts()
				buyCard()

				// }, 1000)
			})
			// }, 3000)
		}
	}

	React.useEffect(() => {
		if (firstRender2) {
			handleBuyClick2('_', true)
		} else {
			setFirstRender2(true)
		}
	}, [purchaseConfirmation2])

	return (
		<div
			data-id={dataId}
			className={id ? 'pokeballs-card opened' : 'pokeballs-card inactive'}
		>
			<img src={background} alt='' className='card-background' />
			<div className='pokeballs-card-status'>
				<div className='card-status-bar' data-status={status}>
					<span className='card-status-bar-line'></span>
					<span className='card-status-bar-label'>{status}%</span>
				</div>
				<div className='card-status-balls'>
					<span className={Number(status) >= Number(100) ? 'show' : null}>
						<img src={pokeball} alt='' />
					</span>
					<span className={Number(status) >= Number(75) ? 'show' : null}>
						<img src={pokeball} alt='' />
					</span>
					<span className={Number(status) >= Number(50) ? 'show' : null}>
						<img src={pokeball} alt='' />
					</span>
					<span className={Number(status) >= Number(25) ? 'show' : null}>
						<img src={pokeball} alt='' />
					</span>
				</div>
			</div>
			<div className='pokeballs-card-info'>
				<img src={image} alt='' />
				<span className='card-info-label'>
					{t`Referrals profit:`} <span>{card_data[2]}$</span>
				</span>
				<span className='card-info-label'>
					{t`Total Wins:`} <span>{card_data[1]}$</span>
				</span>

				<span
					onClick={handleBuyClick2}
					className={`card-info-button ${
						disabledBtn && price > money ? '' : 'card-info-disabled'
					}`}
					disabled={disabledBtn && price > money ? false : true}
				>
					{t`ACTIVATE` + ' ' + price + 'USD'}
				</span>
			</div>
			{accept2 && (
				<BuyPockebolInner
					price={price}
					setPurchaseConfirmation={setPurchaseConfirmation2}
					hideModal={hideModal2}
					setHideModal={setHideModal2}
					setAccept={setAccept2}
				/>
			)}
		</div>
	)
}

const CardClosed = ({ price, buyCard, idCard, category, six, dataId, id }) => {
	const [status, setStatus] = useState()
	const [accept, setAccept] = useState()
	const [purchaseConfirmation, setPurchaseConfirmation] = useState()
	const [firstRender, setFirstRender] = useState(false)
	const [hideModal, setHideModal] = React.useState(false)
	const dispatch = useDispatch()
	const { user } = useSelector(getUser)
	let money = user.money

	async function fetchPosts() {
		console.log('UPDATE USER')
		try {
			const response = await axios.get('/api/user')
			dispatch(setUser(response.data))
		} catch (e) {}
	}

	const handleBuyClick = async () => {
		setAccept(true)

		document.body.style.overflow = 'hidden'
		if (purchaseConfirmation && money >= price) {
			// setTimeout(async () => {
			document.body.style.overflow = 'visible'
			setStatus('pending')
			console.log(category, idCard)
			await axios.get(`/api/${category}/${idCard}`).then(res => {
				setStatus('success')

				// setTimeout(() => {
				buyCard()
				fetchPosts()
				// window.location.reload()
				// }, 1000)
			})
			// }, 1500)
		}
	}

	React.useEffect(() => {
		if (firstRender) {
			handleBuyClick()
		} else {
			setFirstRender(true)
		}
	}, [purchaseConfirmation])

	return (
		<>
			{six === false && idCard === 6 ? (
				<div
					data-id={dataId}
					className={id ? 'pokeballs-card opened' : 'pokeballs-card inactive'}
				>
					<span>
						<div className='pokeballs-card-label2'>
							<img src={q} />
						</div>
					</span>
					<p className='status-x'>40% x4</p>
					<img src={pokeball} className='pokeballs-card-ball' alt='' />
				</div>
			) : (
				<div
					data-id={dataId}
					className={id ? 'pokeballs-card opened' : 'pokeballs-card inactive'}
					onClick={handleBuyClick}
				>
					<div className='pokeballs-card-label'>
						{status === 'pending' ? (
							<span className='status_pending'></span>
						) : status === 'success' ? (
							<span className='status_success'>
								<FontAwesomeIcon
									icon={faCheck}
									className='status_success_check'
								/>
							</span>
						) : (
							<>
								<span className='status-activate'>{t`ACTIVATE`}</span>
								<span className='status-price'>{price} USD</span>
							</>
						)}
					</div>
					<p className='status-x'>40% x4</p>
					<img src={pokeball} className='pokeballs-card-ball' alt='' />
				</div>
			)}
			{accept &&
				(money >= price ? (
					<BuyPockebol
						price={price}
						setPurchaseConfirmation={setPurchaseConfirmation}
						hideModal={hideModal}
						setHideModal={setHideModal}
						setAccept={setAccept}
					/>
				) : (
					<NotEnoughMoney hideModal={hideModal} setAccept={setAccept} />
				))}
		</>
	)
}

export const PokeballsModal = ({
	cards,
	buyCard,
	category,
	images,
	background,
	card_data,
	price,
	six,
}) => {
	return (
		// <div className='pokeballs-modal'>
		// 	{cards.map((id, i) => {
		// 		return (
		// 			<div
		// 				data-id={i + 1}
		// 				className={id ? 'pokeballs-card opened' : 'pokeballs-card inactive'}
		// 			>
		// 				{id ? (
		// 					<CardOpened
		// 						image={images[i]}
		// 						background={background}
		// 						key={id}
		// 						card_data={card_data[i]}
		// 						buyCard={() => buyCard(i + 1)}
		// 						category={category}
		// 						idCard={i + 1}
		// 						price={price[i]}
		// 					/>
		// 				) : (
		// 					<CardClosed
		// 						price={price[i]}
		// 						buyCard={() => buyCard(i + 1)}
		// 						idCard={i + 1}
		// 						category={category}
		// 						six={six}
		// 						key={id}
		// 					/>
		// 				)}
		// 			</div>
		// 		)
		// 	})}
		// </div>
		<div className='pokeballs-modal'>
			{cards.map((id, i) => {
				return (
					<div key={i}>
						{id ? (
							<CardOpened
								image={images[i]}
								background={background}
								key={id}
								card_data={card_data[i]}
								buyCard={() => buyCard(i + 1)}
								category={category}
								idCard={i + 1}
								price={price[i]}
								dataId={i + 1}
								id={id}
							/>
						) : (
							<CardClosed
								price={price[i]}
								buyCard={() => buyCard(i + 1)}
								idCard={i + 1}
								category={category}
								six={six}
								key={id}
								dataId={i + 1}
								id={id}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}
