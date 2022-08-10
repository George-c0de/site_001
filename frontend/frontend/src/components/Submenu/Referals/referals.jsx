import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const Referals = () => {
	// useEffect(() => {
	// 	fetchPosts()
	// 	getLines()
	// }, [])

	// const [lines, setLines] = useState({
	// 	first: {
	// 		total: 0,
	// 		profit: 0,
	// 		lost: 0,
	// 	},
	// 	second: {
	// 		total: 0,
	// 		profit: 0,
	// 		lost: 0,
	// 	},
	// 	third: {
	// 		total: 0,
	// 		profit: 0,
	// 		lost: 0,
	// 	},
	// })
	// const [posts, setPosts] = useState({
	// 	total_line: 0,
	// 	profit: 0,
	// 	lost: 0,
	// 	link: '',
	// })
	// const getLines = async () => {
	// 	await axios.get('/api/get_lines').then(data => {
	// 		const result = {
	// 			first: data.data.first,
	// 			second: data.data.second,
	// 			third: data.data.third,
	// 		}

	// 		console.log('resulet')
	// 		console.log(result)
	// 		console.log('data')
	// 		console.log(data.data)
	// 		setLines(result)
	// 	})
	// }
	// const getFirst = async () => {
	// 	setPosts({
	// 		total_line: lines.first.total,
	// 		profit: lines.first.profit,
	// 		lost: lines.first.lost,
	// 		link: posts.link,
	// 	})
	// 	console.log(posts)
	// }
	// const get_second = async () => {
	// 	setPosts({
	// 		total_line: lines.second.total,
	// 		profit: lines.second.profit,
	// 		lost: lines.second.lost,
	// 		link: posts.link,
	// 	})
	// 	console.log(posts)
	// }
	// const get_third = async () => {
	// 	setPosts({
	// 		total_line: lines.third.total,
	// 		profit: lines.third.profit,
	// 		lost: lines.third.lost,
	// 		link: posts.link,
	// 	})
	// 	console.log(posts)
	// }

	// const linkRef = React.useRef()

	// async function fetchPosts() {
	// 	try {
	// 		const response = await axios.get('/api/user')
	// 		setUser(response.data)
	// 	} catch (e) {}
	// }

	// async function fetchPosts() {
	// 	try {
	// 		const response = await axios.get('/api/referral')
	// 		setPosts(response.data)
	// 	} catch (e) {}
	// }
	useEffect(() => {
		fetchPosts()
		getLines()
		getUsername()
	}, [])
	const [user, setUser] = useState({
		id: 0,
		money: '0.00',
		referral_link: '',
		referral_amount: '0.00',
		missed_amount: '0.00',
		wallet: null,
		line_1: null,
		line_2: null,
		line_3: null,
		max_card: 0,
		admin_or: false,
		user: 0,
	})

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
			console.log(response.data)
			setPosts(response.data)
		} catch (e) {
			console.log(e)
		}
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

			console.log('resulet')
			console.log(result)
			console.log('data')
			console.log(data.data)
			setLines(result)
		})
	}
	const getFirst = async () => {
		setPosts({
			total_line: lines.first.total,
			profit: lines.first.profit,
			lost: lines.first.lost,
			link: posts.link,
		})
		console.log(posts)
	}
	const get_second = async () => {
		setPosts({
			total_line: lines.second.total,
			profit: lines.second.profit,
			lost: lines.second.lost,
			link: posts.link,
		})
		console.log(posts)
	}

	const get_third = async () => {
		setPosts({
			total_line: lines.third.total,
			profit: lines.third.profit,
			lost: lines.third.lost,
			link: posts.link,
		})
		console.log(posts)
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
					https://tokemon.games/{user?.referral_link}
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
						className='referals__btn yellow-btn'
						onClick={getFirst}
					>{t`1 line`}</button>
					<p className='referals__text'>{t`Total person`}:</p>
					<ul className='referals__count-wrapper'>
						<li>{posts.total_line}</li>
					</ul>
				</div>
				<div className='referals__info'>
					<button
						className='referals__btn yellow-btn'
						onClick={get_second}
					>{t`2 line`}</button>
					<p className='referals__text'>{t`Profit received`}:</p>
					<ul className='referals__count-wrapper'>
						<li>{posts.profit}$</li>
					</ul>
				</div>
				<div className='referals__info'>
					<button
						className='referals__btn yellow-btn yellow-btn-last'
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
