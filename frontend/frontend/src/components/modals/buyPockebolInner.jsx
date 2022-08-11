import React from 'react'
import './modals.css'
import Cross from '../../assets/cross-svgrepo-com.svg'
import { t } from 'ttag'

const BuyPockebolInner = props => {
	const ref = React.useRef(null)
	const { openMenu, setOpenMenu, price, setAnswer } = props
	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			 setOpenMenu(false)
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
		 setOpenMenu(false)
		document.body.style.overflow = 'visible'
	}

	const confirmPurchase = () => {
		 setOpenMenu(false)
		 setAnswer(true)
		document.body.style.overflow = 'visible'
	}

	return (
		<div
			className={`subscriibe-wrapper buy-wrapper ${
				openMenu ? 'buy-wrapper-hide' : ''
			}`}
		>
			<div className='subscriibe-block' ref={ref}>
				<img
					src={Cross}
					alt=''
					className='subcribe-cross'
					onClick={handleClick}
				/>
				<p className='buy-text'>
					{t`Purchase price` +
						' ' +
						price +
						'USD. ' +
						t`Would you like to continue?`}
				</p>
				<div className='buy-btns-wrapper'>
					<button
						onClick={confirmPurchase}
						className='authorization__button subscribe-btn buy-btn'
					>
						{t`Yes`}
					</button>
					<button
						onClick={handleClick}
						className='authorization__button subscribe-btn buy-btn'
					>
						{t`No`}
					</button>
				</div>
			</div>
		</div>
	)
}

export default BuyPockebolInner
