import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Images
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import q from '../../../../Ảnh Pokemon Dự Trù/Знак вопроса.svg'
import './PokeballsModal.css'
import BuyPockebol from '../../../modals/BuyPockebol'

const CardOpened = ({
	image,
	buyCard,
	background,
	card_data,
	idCard,
	category,
}) => {
	const [status, setStatus] = useState(card_data[0])
	console.log(status)
	console.log(card_data[0])
	const handleStatusBalls = e => {
		const statusBall = e.target.closest('[data-status]')
		if (statusBall) {
			statusBall.classList.toggle('show')
			setStatus(card_data[0])
		}
	}
	const handleBuyClick = () => {
		setTimeout(async () => {
			await axios.get(`/api/${category}/${idCard}`).then(res => {
				setTimeout(() => {
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
					Refelrel Profit: <span>{card_data[2]}$</span>
				</span>
				<span className='card-info-label'>
					Total Wins: <span>{card_data[1]}$</span>
				</span>

				<span onClick={handleBuyClick} className='card-info-button'>
					Activate
				</span>
			</div>
		</>
	)
}

const CardClosed = ({ price, buyCard, idCard, category, six }) => {
	const [status, setStatus] = useState()
	const [accept, setAccept] = useState(false)
	const [purchaseConfirmation, setPurchaseConfirmation] = useState()
	const [firstRender, setFirstRender] = useState(false)
	const [hideModal, setHideModal] = React.useState(false)

	const handleBuyClick = () => {
		setAccept(true)
		console.log(accept)
		purchaseConfirmation &&
			setTimeout(async () => {
				setStatus('pending')
				console.log('ПОКУПКА СОВЕРШЕНА')
				await axios.get(`/api/${category}/${idCard}`).then(res => {
					setStatus('success')
					setTimeout(() => {
						buyCard()
					}, 1000)
				})
			}, 3000)
	}

	React.useEffect(() => {
		if (firstRender) {
			handleBuyClick()
		} else {
			setFirstRender(true)
		}
	}, [purchaseConfirmation])
	return (
		<div>
			{six === false && idCard === 6 ? (
				<span>
					<div className='pokeballs-card-label2'>
						<img src={q} />
					</div>
				</span>
			) : (
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
							<span>ACTIVATE</span>
							<span>{price} USD</span>
						</>
					)}
				</div>
			)}
			<img src={pokeball} className='pokeballs-card-ball' alt='' />
			{accept && (
				<BuyPockebol
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
	amount,
	category,
	images,
	background,
	card_data,
	price,
	six,
}) => {
	const [cards, setCards] = useState([])
	const buyCard = async id => {
		const newCards = [...cards]
		newCards[id - 1] = id
		setCards(newCards)
	}

	useEffect(() => {
		const array = [0, 0, 0, 0, 0, 0]
		if (amount.length > 0) {
			for (let i = 0; i < amount.length; i++) {
				array[amount[i] - 1] = amount[i]
			}
		}

		setCards(array)
	}, [amount])

	return (
		<div className='pokeballs-modal'>
			{cards.map((id, i) => {
				console.log(id)
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
