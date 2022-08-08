import React from 'react'
import './buy.css'
import Cross from '../../assets/cross-svgrepo-com.svg'

const BuyPockebol = props => {
	const ref = React.useRef(null)
	const { hideModal, setHideModal, setPurchaseConfirmation, setAccept } = props

	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setAccept(false)
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
	}

	const confirmPurchase = () => {
		setPurchaseConfirmation(true)
		setAccept(false)
		setHideModal(true)
	}

	return (
		<div
			className={`subscriibe-wrapper buy-wrapper ${
				hideModal ? 'buy-wrapper-hide' : ''
			}`}
			ref={ref}
		>
			<div className='subscriibe-block'>
				<img
					src={Cross}
					alt=''
					className='subcribe-cross'
					onClick={handleClick}
				/>
				<p className='buy-text'>После подтверждения с вас спишется ...</p>
				<p
					onClick={confirmPurchase}
					className='authorization__button subscribe-btn'
					target='__blank'
				>
					Подтвердить покупку
				</p>
			</div>
		</div>
	)
}

export default BuyPockebol
