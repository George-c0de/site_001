import React, { useState } from 'react'
import './subscribe.css'
import Telegram from '../../assets/tg.svg'
import Cross from '../../assets/cross-svgrepo-com.svg'
import { t } from 'ttag'

const SubscribeTg = () => {
	const [activeTg, setActiveTg] = useState(true)

	const ref = React.useRef(null)

	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setActiveTg(false)
		}
	}

	const handleClick = () => {
		setActiveTg(false)
	}

	React.useEffect(() => {
		document.cookie = 'openTg'
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	if (document.cookie.includes('openTg')) return

	return (
		<div className={`subscriibe-wrapper ${activeTg ? '' : 'sub-wrapper-hide'}`}>
			<div className='subscriibe-block' ref={ref}>
				<img
					src={Cross}
					alt=''
					className='subcribe-cross'
					onClick={handleClick}
				/>
				<p className='subscribe-text'>
					{t`Subscribe to us on Telegram to receive information about your winnings`}
				</p>
				<a
					className='authorization__button subscribe-btn'
					href='https://t.me/Tokemon_game_Bot'
					target='__blank'
				>
					<img src={Telegram} alt='' className='authorization__img' />
					{t`Subscribe to Telegram`}
				</a>
			</div>
		</div>
	)
}

export default SubscribeTg
