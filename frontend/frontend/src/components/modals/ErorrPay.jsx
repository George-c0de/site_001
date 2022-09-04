import React from 'react'
import './modals.css'
import { t } from 'ttag'

const PaySendError = ({ setOpenModal }) => {
	const ref = React.useRef(null)

	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOpenModal(false)
		}
	}

	const handleClick = () => {
		setOpenModal(false)
	}

	React.useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)
		document.cookie = 'openTg'
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	return (
		<div className={`subscriibe-wrapper`}>
			<div className='subscriibe-block' ref={ref} style={{ maxWidth: '420px' }}>
				<p className='subscribe-text'>
					{t`This wallet is assigned to another user. To withdraw funds, use another wallet`}
				</p>
				<p
					onClick={handleClick}
					className='authorization__button subscribe-btn'
				>
					{t`Continue`}
				</p>
			</div>
		</div>
	)
}

export default PaySendError
