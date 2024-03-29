import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../redux/slices/selectors'
import { setUser } from '../../redux/slices/userSlice'

const Referals = () => {
	useEffect(() => {
		fetchPosts()
		fetchUser()
		getLines()
		getUsername()
	}, [])
	const [activeStat, setActiveStat] = React.useState()
	const dispatch = useDispatch()
	const { user } = useSelector(getUser)

	async function fetchUser() {
		if (user.id == '') {
			try {
				const response = await axios.get('/api/user')
				dispatch(setUser(response.data))
			} catch (e) {}
		}
	}

	const [lines, setLines] = useState({
		first: {
			total: 0,
			profit: 0,
			lost: 0,
		},
		second: {
			total: 0,
			profit: 0,
			lost: 0,
		},
		third: {
			total: 0,
			profit: 0,
			lost: 0,
		},
	})
	const [posts, setPosts] = useState({
		total_line: 0,
		profit: 0,
		lost: 0,
		link: '',
	})

	async function fetchPosts() {
		try {
			const response = await axios.get('/api/referral')
			setPosts(response.data)
		} catch (e) {}
	}

	let getUsername = async () => {
		const res = await axios.get('/api/user')
		setUser(res.data)
	}

	const getLines = async () => {
		await axios.get('/api/get_lines').then(data => {
			const result = {
				first: data.data.first,
				second: data.data.second,
				third: data.data.third,
			}

			setLines(result)
		})
	}
	const getFirst = async () => {
		setActiveStat(0)
		setPosts({
			total_line: lines.first.total,
			profit: lines.first.profit,
			lost: lines.first.lost,
			link: posts.link,
		})
	}
	const get_second = async () => {
		setActiveStat(1)
		setPosts({
			total_line: lines.second.total,
			profit: lines.second.profit,
			lost: lines.second.lost,
			link: posts.link,
		})
	}

	const get_third = async () => {
		setActiveStat(2)
		setPosts({
			total_line: lines.third.total,
			profit: lines.third.profit,
			lost: lines.third.lost,
			link: posts.link,
		})
	}

	const linkRef = React.useRef()
	const copyRef = React.useRef()
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

	return (
		<div className='referals__container'>
			<div className='referals__link'>
				<h3 className='referals__title'>{t`Referral link`}</h3>
				<a className='link-invite referals-link' ref={linkRef}>
					window.location.origin/login/{user?.referral_link}
					<FontAwesomeIcon
						icon={faCopy}
						ref={copyRef}
						className='copy-icon'
						onClick={handleCopy}
					/>
				</a>
			</div>
			<div className='referals__info-wrapper'>
				<div className='referals__info'>
					<button
						className={`referals__btn yellow-btn yellow-btn-last ${
							activeStat === 0 ? 'referals__btn-active' : ''
						}`}
						onClick={getFirst}
					>{t`1 line`}</button>
					<p className='referals__text'>{t`Total person`}:</p>
					<ul className='referals__count-wrapper'>
						<li>{posts.total_line}</li>
					</ul>
				</div>
				<div className='referals__info'>
					<button
						className={`referals__btn yellow-btn yellow-btn-last ${
							activeStat === 1 ? 'referals__btn-active' : ''
						}`}
						onClick={get_second}
					>{t`2 line`}</button>
					<p className='referals__text'>{t`Profit received`}:</p>
					<ul className='referals__count-wrapper'>
						<li>{posts.profit}$</li>
					</ul>
				</div>
				<div className='referals__info'>
					<button
						className={`referals__btn yellow-btn yellow-btn-last ${
							activeStat === 2 ? 'referals__btn-active' : ''
						}`}
						onClick={get_third}
					>
						{t`3 line`}
					</button>
					<p className='referals__text'>{t`Lost profits`}:</p>
					<ul className='referals__count-wrapper'>
						<li>{posts.lost}$</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Referals
