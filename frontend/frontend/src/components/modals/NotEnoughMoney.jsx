import React from 'react'
import './modals.css'
import Cross from '../../assets/cross-svgrepo-com.svg'
import { t } from 'ttag'

const NotEnoughMoney = props => {
	const ref = React.useRef(null)
	const { hideModal, setAccept } =
		props
	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setAccept(false)
			document.body.style.overflow = 'visible'
		}
	}

	React.useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	const handleClick = () => {
		setAccept(false)
		document.body.style.overflow = 'visible'
	}

	return (
		<div
			className={`subscriibe-wrapper buy-wrapper ${
				hideModal ? 'buy-wrapper-hide' : ''
			}`}
		>
			<div className='subscriibe-block' ref={ref}>
				<p className='buy-text'>{t`Insufficient funds to purchase the card`}</p>
				<div className='buy-btns-wrapper'>
					<button
						onClick={handleClick}
						className='authorization__button subscribe-btn money-btn'
					>
						{t`Continue`}
					</button>
				</div>
			</div>
		</div>
	)
}
export default NotEnoughMoney