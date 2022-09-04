import React, { useState } from 'react'
import './modals.css'
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
		document.addEventListener('click', handleClickOutside, true)
		document.cookie = 'openTg=true'
		fetchLink()
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	const [get_link_tg, setget_link_tg] = React.useState({
		link_tg: 'https://t.me/Tokemon_game_Bot',
	})

	async function fetchLink() {
		try {
			const response = await axios.get('/api/get_link_tg')
			setget_link_tg(response.data.link_tg)
		} catch (e) {
			if (e.response.status !== 200) {
				let data_ = 'https://t.me/Tokemon_game_Bot'
				setget_link_tg(data_)
			}
		}
	}

	if (document.cookie.includes('openTg=true')) return

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
					href={get_link_tg}
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
