import React from 'react'
import './modals.css'
import { t } from 'ttag'

const PaySend = ({setOpenModal}) => {
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
		<div
			className={`subscriibe-wrapper`}
		>
			<div className='subscriibe-block' ref={ref} style={{ maxWidth: '377px' }}>
				<p className='subscribe-text'>
					{t`Withdrawal request successfully created`}
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

export default PaySend
