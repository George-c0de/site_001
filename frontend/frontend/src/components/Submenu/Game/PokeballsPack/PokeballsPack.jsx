import './PokeballsPack.css'
import React, { useState } from 'react'
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg'
import PokebolOpened from '../../../../assets/Открытый пакебол-min.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { PokeballsModal } from '../PokeballsModal/PokeballsModal'
import { t } from 'ttag'

const COLORS_TO_CLASS = {
	bronze: 'text-pokeball-1',
	bronco: 'text-pokeball-1',
	bronce: 'text-pokeball-1',
	bronzo: 'text-pokeball-1',
	бронза: 'text-pokeball-1',
	silver: 'text-pokeball-2',
	prata: 'text-pokeball-2',
	"d'argento": 'text-pokeball-2',
	argent: 'text-pokeball-2',
	silber: 'text-pokeball-2',
	plata: 'text-pokeball-2',
	серебро: 'text-pokeball-2',
	gold: 'text-pokeball-3',
	золото: 'text-pokeball-3',
	ouro: 'text-pokeball-3',
	oro: 'text-pokeball-3',
	or: 'text-pokeball-3',
	emerald: 'text-pokeball-4',
	esmeralda: 'text-pokeball-4',
	smeraldo: 'text-pokeball-4',
	émeraude: 'text-pokeball-4',
	smaragd: 'text-pokeball-4',
	изумруд: 'text-pokeball-4',
}

export const PokeballsPack = ({
	title,
	category,
	amount,
	images,
	background,
	card_data,
	price,
	six,
}) => {
	const [modalOpen, setModalOpen] = useState(false)
	const handlePokeballsPack = () => {
		setModalOpen(!modalOpen)
	}

	// ПЕРЕНЕСЕНО ИЗ POKEBALLSMODAL
	const [cards, setCards] = useState([])
	const buyCard = async id => {
		const newCards = [...cards]
		newCards[id - 1] = id
		setCards(newCards)
	}

	React.useEffect(() => {
		const array = [1, 0, 0, 0, 0, 0]
		if (amount.length > 0) {
			for (let i = 0; i < amount.length; i++) {
				array[amount[i] - 1] = amount[i]
			}
		}

		setCards(array)
	}, [amount])
	///
	const ref = React.useRef(null)

	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setModalOpen(false)
		}
	}

	React.useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	return (
		<div className='col-sm' id='title-pack-pokeballs'>
			<span className='pokebolls-title'>{t`Cards`}</span>
			<div
				ref={ref}
				className={
					modalOpen ? 'pokeballs-container open' : 'pokeballs-container'
				}
			>
				<div className='detail-wrapper' onClick={handlePokeballsPack}>
					<div id='pokeballs-detail'>
						<img
							src={cards[0] <= 0 ? pokeball : PokebolOpened}
							alt='pokeball'
							className='small-pokeball'
						/>
						<img
							src={cards[1] <= 0 ? pokeball : PokebolOpened}
							className='small-pokeball'
							alt='pokeball'
						/>
						<img
							src={cards[2] <= 0 ? pokeball : PokebolOpened}
							className='small-pokeball'
							alt='pokeball'
						/>
						<img
							src={cards[3] <= 0 ? pokeball : PokebolOpened}
							className='small-pokeball'
							alt='pokeball'
						/>
						<img
							src={cards[4] <= 0 ? pokeball : PokebolOpened}
							className='small-pokeball'
							alt='pokeball'
						/>
						<img
							src={cards[5] <= 0 ? pokeball : PokebolOpened}
							className='small-pokeball'
							alt='pokeball'
						/>
					</div>
					<div
						onClick={handlePokeballsPack}
						className={
							COLORS_TO_CLASS[title.toLowerCase()] || 'text-pokeball-default'
						}
					>
						{title}
					</div>
					<div className='icon-showdown-container'>
						<FontAwesomeIcon icon={faChevronDown} className='icon-showdown' />
					</div>
				</div>

				<PokeballsModal
					cards={cards}
					buyCard={buyCard}
					background={background}
					amount={amount}
					images={images}
					category={category?.toLowerCase()}
					card_data={card_data}
					price={price}
					six={six}
				/>
			</div>
		</div>
	)
}
