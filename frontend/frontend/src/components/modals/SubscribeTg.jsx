import React, { useState } from 'react'
import './subscribe.css'
import Telegram from '../../assets/tg.svg'
import Cross from '../../assets/cross-svgrepo-com.svg'
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
		localStorage.setItem('subscribe', true)
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	if (localStorage.getItem('subscribe')) return
	
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
					Подпишитесь на телеграмм чтобы быть в курсе всех новостей
				</p>
				<a
					className='authorization__button subscribe-btn'
					href='https://t.me/Tokemon_game_Bot'
					target='__blank'
				>
					Подписаться на телеграмм
				</a>
			</div>
		</div>
	)
}

export default SubscribeTg
