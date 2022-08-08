import React, { useEffect, useState } from 'react'
import axios from 'axios'

import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import q from '../../../../Ảnh Pokemon Dự Trù/Знак вопроса.svg'
import './PokeballsModal.css'
import BuyPockebol from '../../../modals/BuyPockebol'
import { t } from 'ttag'

const CardOpened = ({
	image,
	buyCard,
	background,
	card_data,
	idCard,
	category,
}) => {
	const [status, setStatus] = useState(card_data[0])
	// const handleStatusBalls = e => {
	// 	const statusBall = e.target.closest('[data-status]')
	// 	if (statusBall) {
	// 		statusBall.classList.toggle('show')
	// 		setStatus(card_data[0])
	// 	}
	// }

	const handleBuyClick = () => {
		setTimeout(async () => {
			await axios.get(`/api/${category}/${idCard}`).then(res => {
				setTimeout(() => {
					console.log('BUY CARD')
					buyCard()
				}, 1000)
			})
		}, 3000)
	}

	return (
		<>
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

				<span onClick={handleBuyClick} className='card-info-button'>
					{t`ACTIVATE`}
				</span>
			</div>
		</>
	)
}

const CardClosed = ({ price, buyCard, idCard, category, six }) => {
	const [status, setStatus] = useState()
	const [accept, setAccept] = useState()
	const [purchaseConfirmation, setPurchaseConfirmation] = useState()
	const [firstRender, setFirstRender] = useState(false)
	const [hideModal, setHideModal] = React.useState(false)

	const handleBuyClick = () => {
		setAccept(true)
		document.body.style.overflow = 'hidden'
		purchaseConfirmation &&
			setTimeout(async () => {
				document.body.style.overflow = 'visible'
				setStatus('pending')
				await axios.get(`/api/${category}/${idCard}`).then(res => {
					setStatus('success')
					setTimeout(() => {
						buyCard()
					}, 1000)
				})
			}, 1500)
	}

	const handleButton = async () => {
		await axios.get(`/api/prohibitions`).then(res => {
			console.log(res)
			console.log(res.data)
		})
	}

	React.useEffect(() => {
		if (firstRender) {
			handleBuyClick()
			handleButton()
		} else {
			setFirstRender(true)
		}
	}, [purchaseConfirmation])

	return (
		<div>
			{six === false && idCard === 6 ? (
				<>
					<span>
						<div className='pokeballs-card-label2'>
							<img src={q} />
						</div>
					</span>
					<p className='status-x'>40% x4</p>
				</>
			) : (
				<>
					<div className='pokeballs-card-label' onClick={handleBuyClick}>
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
								<span>{t`ACTIVATE`}</span>
								<span className='status-price'>{price} USD</span>
							</>
						)}
					</div>
					<p className='status-x'>40% x4</p>
				</>
			)}
			<img src={pokeball} className='pokeballs-card-ball' alt='' />
			{accept && (
				<BuyPockebol
					price={price}
					setPurchaseConfirmation={setPurchaseConfirmation}
					hideModal={hideModal}
					setHideModal={setHideModal}
					setAccept={setAccept}
				/>
			)}
		</div>
	)
}

export const PokeballsModal = ({
	cards,
	buyCard,
	amount,
	category,
	images,
	background,
	card_data,
	price,
	six,
}) => {
	return (
		<div className='pokeballs-modal'>
			{cards.map((id, i) => {
				return (
					<div
						data-id={i + 1}
						className={id ? 'pokeballs-card opened' : 'pokeballs-card inactive'}
					>
						{id ? (
							<CardOpened
								image={images[i]}
								background={background}
								key={id}
								card_data={card_data[i]}
								buyCard={() => buyCard(i + 1)}
								category={category}
								idCard={i + 1}
							/>
						) : (
							<CardClosed
								price={price[i]}
								buyCard={() => buyCard(i + 1)}
								idCard={i + 1}
								category={category}
								six={six}
								key={id}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}
