import React, { useEffect, useRef } from 'react'
import satoshi from '../../Ảnh Pokemon Dự Trù/123133.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import './UserId.css'
import { t } from 'ttag'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/slices/userSlice'
import { getUser } from '../redux/slices/selectors'

export const UserId = () => {
	const linkRef = useRef()
	const copyRef = useRef()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { user } = useSelector(getUser)
	useEffect(() => {
		fetchPosts()
	}, [])

	async function fetchPosts() {
		console.log('SEND USER')
		if (user.id == '') {
			try {
				const response = await axios.get('/api/user')
				dispatch(setUser(response.data))
			} catch (e) {}
		}
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(linkRef.current?.innerText)
		document.addEventListener(
			'touchstart',
			function () {
				copyRef.current.style.color = '#ffcc00'
			},
			true
		)
		document.addEventListener(
			'touchend',
			function () {
				copyRef.current.style.color = '#ffffff'
			},
			true
		)
	}
	const Deposit = () => {
		navigate('/home/deposit')
	}
	const Withdraw = () => {
		navigate('/home/pay')
	}
	return (
		<div className='user-info-container'>
			<span className='user-id'>
				{t`User Id`}-{user?.id}
			</span>
			<div className='user-info-wrapper'>
				<ul className='user-info'>
					<li>
						{t`Balance`}: <span>{user?.money}$</span>
					</li>
					<li>
						{t`Cards profit`}: <span>{user?.missed_amount}$</span>
					</li>
					<li>
						{t`Referal profit`}: <span>{user?.referral_amount}$</span>
					</li>
					<li>{t`Link for invitation`} </li>

					<span className='link-invite referals-link' ref={linkRef}>
						https://tokemon.games/login/{user?.referral_link}
						<FontAwesomeIcon
							ref={copyRef}
							icon={faCopy}
							className='copy-icon'
							onClick={handleCopy}
						/>
					</span>

					<div className='user-info-buttons'>
						<button
							onClick={Deposit}
							className='yellow-btn'
						>{t`Deposit`}</button>
						<button
							onClick={Withdraw}
							className='yellow-btn'
						>{t`Withdraw`}</button>
					</div>
					<img className='satoshi' src={satoshi} alt='' />
				</ul>
			</div>
		</div>
	)
}
