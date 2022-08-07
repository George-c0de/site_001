import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lang } from '../MainPage/Lang/Lang'

import './Deposit.css'
import axios from 'axios'
import { t } from 'ttag'
import Header from '../Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const Deposit = () => {
	const [onActive, setActive] = useState(true)
	const navigate = useNavigate()
	const [state_input, SetState] = useState(true)
	const [data, setData] = useState({
		wallet: '',
		col: 1,
	})
	const [maxi, setMax] = useState(1)
	let [tran, SetTran] = useState([])
	let [user, setUser] = useState({
		id: 0,
		money: 0,
		referral_link: '',
		referral_amount: '',
		missed_amount: '',
		wallet: null,
		line_1: null,
		line_2: null,
		line_3: null,
		max_card: 0,
		admin_or: false,
		user: 0,
	})
	useEffect(() => {
		getTran()
	}, [])
	const getTran = async () => {
		try {
			let response = await axios.get('/api/trans_get_output')

			if (response.data.lenth > 0) {
				SetTran(response.data)
			} else {
				SetTran([0])
			}
			// let a =
			//     [{
			//         'quantity': '10.00',
			//         'data': '2022, 7, 18',
			//         'time': '13:58:12',
			//         'txid': 'sfsfgsfjshkfjs'
			//     }, {'quantity': '465.00', 'data': '2022, 7, 18', 'time': '13:58:12', 'txid': 'asf4gsgs'}]

			//let data = await response.data

			//SetTran(a)
			//console.log(a)
		} catch (e) {}
	}
	useEffect(() => {
		const getPosts = async () => {
			try {
				await axios.get('/api/user').then(data => {
					const result = {
						id: data.data.id,
						money: data.data.money,
						referral_link: data.data.referral_link,
						referral_amount: data.data.referral_amount,
						missed_amount: data.data.missed_amount,
						wallet: data.data.wallet,
						line_1: data.data.line_1,
						line_2: data.data.line_2,
						line_3: data.data.line_3,
						max_card: data.data.max_card,
						admin_or: data.data.admin_or,
						user: data.data.user,
					}
					setUser(result)
					setMax(result.money)
				})

				if (user.wallet !== null) {
					setData({
						wallet: user.wallet,
						col: 1,
					})
					console.log(data.wallet)
					SetState(true)
				} else {
					setData({
						wallet: '',
						col: 1,
					})
					console.log('yes')
					SetState(false)
				}
			} catch (e) {
				console.log(e)
				console.log(data)
			}
			console.log(user)
		}
		getPosts()
	}, [user.id])

	const handleSum = e => {
		setData({
			wallet: data.wallet,
			col: e.target.value,
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (data.col < 1) {
			alert('Error')
		} else {
			try {
				axios
					.post(
						'/api/dis_input',
						{
							wallet: data.wallet,
							col: data.col,
						},
						{
							headers: { 'Content-Type': 'application/json' },
						}
					)
					.then(function (response) {})
					.catch(function (error) {})
			} catch (e) {
				if (e.response.status === 200) {
					data.col = 1
					alert('Ok')
				} else {
					alert('Error')
				}
			}
		}
	}
	const hundSum = e => {
		setData({
			wallet: e.target.value,
			col: data.col,
		})
	}
	const handleCopy = () => {
		navigator.clipboard.writeText(linkRef.current?.innerText)
	}
	const linkRef = React.useRef()
	return (
		<div className='homepage-wrapper'>
			<div className='main_container'>
				<Header />
			</div>
			<form onSubmit={handleSubmit}>
				<div className='deposit-wrapper'>
					<div className='deposit-wrapper-form'>
						<div className='deposit-title-wrapper'>
							<h1 className='deposit-title'>{t`Deposit`}</h1>
							<span className='deposit-subtitle'>{t`Balance`}:</span>
							<span className='deposit-money'>{user.money}$</span>
						</div>
						<div className='deposit-inputs-wrapper deposit-inputs-deposit'>
							{/* <div className='deposit-input deposit-input-deposit'>
								<label htmlFor='address-input'>{t`Top up address`}:</label>
								<input
									required
									type='text'
									className='deposit-sum-inp-deposit'
									name='sum-input'
									value={data.wallet}
								/>
							</div> */}
							<div className='deposit-input deposit-input-deposit'>
								<span className='link-invite deposit-link' ref={linkRef}>
									1312123123
									<FontAwesomeIcon
										icon={faCopy}
										className='copy-icon deposit-copy-icon'
										onClick={handleCopy}
									/>
								</span>
							</div>
						</div>
						<button
							type={'submit'}
							className='deposit-button'
						>{t`Deposit`}</button>
					</div>
					<div className='deposit-history-wrapper'>
						<span className='deposit-history-title'>{t`TRANSACTION HISTORY`}</span>
						<div className='deposit-history-table'>
							<div className='history-table-column'>
								<span className='history-table-title'>{t`Time`}</span>
								{tran.map(trans => {
									return <h3>{trans.time}</h3>
								})}
							</div>
							<div className='history-table-column'>
								<span className='history-table-title'>{t`Date`}</span>
								{tran.map(trans => {
									return <h3>{trans.data}</h3>
								})}
							</div>
							<div className='history-table-column'>
								<span className='history-table-title'>
									Txid {t`TRANSACTION`}
								</span>
								{tran.map(trans => {
									return <h3>{trans.txid}</h3>
								})}
							</div>
							<div className='history-table-column'>
								<span className='history-table-title sum'>{`Sum`}</span>
								{tran.map(trans => {
									return <h3>{trans.quantity}</h3>
								})}
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}
export default Deposit
