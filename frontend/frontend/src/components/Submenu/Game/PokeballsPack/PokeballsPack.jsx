import React, { useState } from 'react'

// Images
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

// Pages
import { PokeballsModal } from '../PokeballsModal/PokeballsModal'

import './PokeballsPack.css'
import { t } from 'ttag'

const COLORS_TO_CLASS = {
	bronze: 'text-pokeball-1',
	bronco: 'text-pokeball-1',
	bronce: 'text-pokeball-1',
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

	return (
		<div className='col-sm' id='title-pack-pokeballs'>
			<span>{t`Cards`}</span>
			<div
				className={
					modalOpen ? 'pokeballs-container open' : 'pokeballs-container'
				}
			>
				<div className='detail-wrapper' onClick={handlePokeballsPack}>
					<div id='pokeballs-detail'>
						<img src={pokeball} className='small-pokeball' alt='' />
						<img src={pokeball} className='small-pokeball' alt='' />
						<img src={pokeball} className='small-pokeball' alt='' />
						<img src={pokeball} className='small-pokeball' alt='' />
						<img src={pokeball} className='small-pokeball' alt='' />
						<img src={pokeball} className='small-pokeball' alt='' />
					</div>
					<div
						className={
							COLORS_TO_CLASS[title.toLowerCase()] || 'text-pokeball-dedfault'
						}
					>
						{title}
					</div>
					<div className='icon-showdown-container'>
						<FontAwesomeIcon icon={faChevronDown} className='icon-showdown' />
					</div>
				</div>

				<PokeballsModal
					background={background}
					amount={amount}
					images={images}
					category={title?.toLowerCase()}
					card_data={card_data}
					price={price}
					six={six}
				/>
			</div>
		</div>
	)
}
