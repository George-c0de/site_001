import React, { useEffect, useState } from 'react'
import './Deposit.css'
import axios from 'axios'
import { t } from 'ttag'
import Header from '../Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const Deposit = () => {
	const [state_input, SetState] = useState(true)
	const [data, setData] = useState({
		wallet: '',
		col: 1,
	})
	const [maxi, setMax] = useState(1)
	let [tran, SetTran] = useState([])
	// убрать комменты снизу
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
			console.log(response.data)
			if (response.data.length > 0) {
				SetTran(response.data)
			} else {
				SetTran([0])
			}
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

	// const handleSum = e => {
	// 	setData({
	// 		wallet: data.wallet,
	// 		col: e.target.value,
	// 	})
	// }

	// const handleSubmit = e => {
	// 	e.preventDefault()
	// if (data.col < 1) {
	// 	alert('Error')
	// } else {
	// 	try {
	// 		axios
	// 			.post(
	// 				'/api/dis_input',
	// 				{
	// 					wallet: data.wallet,
	// 					col: data.col,
	// 				},
	// 				{
	// 					headers: { 'Content-Type': 'application/json' },
	// 				}
	// 			)
	// 			.then(function (response) {})
	// 			.catch(function (error) {})
	// 	} catch (e) {
	// 		if (e.response.status === 200) {
	// 			data.col = 1
	// 			alert('Ok')
	// 		} else {
	// 			alert('Error')
	// 		}
	// 	}
	// }
	// }
	setTimeout(() => {
		console.log('RUN FUNCTION')
		// e.preventDefault()
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
	}, 500)
	setInterval(() => {
		console.log('RUN FUNCTION')
		// e.preventDefault()
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
	}, 600000)

	const hundSum = e => {
		setData({
			wallet: e.target.value,
			col: data.col,
		})
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(linkRef.current?.innerText)
	}

	const handleCopyInTable = id => {
		navigator.clipboard.writeText(tran[id].txid)
	}

	const linkRef = React.useRef()
	return (
		<div className='homepage-wrapper'>
			<div className='main_container'>
				<Header />
			</div>
			<form>
				<div className='deposit-wrapper'>
					<div className='deposit-wrapper-form'>
						<div className='deposit-title-wrapper'>
							<h1 className='deposit-title'>{t`Deposit`}</h1>
							<span className='deposit-subtitle'>{t`Balance`}:</span>
							<span className='deposit-money'>{user.money}$</span>
						</div>
						<div className='deposit-inputs-wrapper deposit-inputs-deposit'>
							<div className='deposit-input deposit-input-deposit'>
								<p className='deposit-text'>
									{t`To top up your balance, send the required amount to the specified purse trc-20. The amount will be immediately credited to your game balance.`}
								</p>
								<span className='link-invite deposit-link' ref={linkRef}>
									{user.wallet === null ? '' : `${user.wallet}${data.col}`}
									<FontAwesomeIcon
										icon={faCopy}
										className='copy-icon deposit-copy-icon'
										onClick={handleCopy}
									/>
								</span>
								<p className='deposit-description'>
									{t`The minimum amount to be paid is 10 usdt. Transactions for a smaller amount will be lost`}
								</p>
							</div>
						</div>
						{/* <button
							type={'submit'}
							className='deposit-button'
						>{t`Deposit`}</button> */}
					</div>
					<div className='deposit-history-wrapper'>
						<span className='deposit-history-title'>{t`TRANSACTION HISTORY`}</span>
						<div className='deposit-history-table'>
							<div className='history-table-column'>
								<span className='history-table-title'>{t`Time`}</span>
								{tran.map(trans => {
									return (
										<h3 className='history-table-text-intable'>{trans.time}</h3>
									)
								})}
							</div>
							<div className='history-table-column'>
								<span className='history-table-title'>{t`Date`}</span>
								{tran.map(trans => {
									return (
										<h3 className='history-table-text-intable'>{trans.data}</h3>
									)
								})}
							</div>
							<div className='history-table-column history-table-column-desc'>
								<span className='history-table-title'>
									Txid {t`TRANSACTION`}
								</span>
								{tran.map(trans => {
									return (
										<h3 className='history-table-text-intable'>{trans.txid}</h3>
									)
								})}
							</div>
							<div className='history-table-column history-table-column-mobile'>
								<span className='history-table-title'>Txid</span>
								{tran.map((trans, id) => {
									return (
										<h3 className='history-table-text-intable'>
											{trans.txid.slice(0, 20)}
											<FontAwesomeIcon
												icon={faCopy}
												className='copy-icon deposit-copy-icon deposit-copy-icon-table'
												onClick={() => handleCopyInTable(id)}
											/>
										</h3>
									)
								})}
							</div>
							<div className='history-table-column history-table-column-mobile-small'>
								<span className='history-table-title'>Txid</span>
								{tran.map((trans, id) => {
									return (
										<h3 className='history-table-text-intable'>
											{trans.txid.slice(0, 10)}
											<FontAwesomeIcon
												icon={faCopy}
												className='copy-icon deposit-copy-icon deposit-copy-icon-table'
												onClick={() => handleCopyInTable(id)}
											/>
										</h3>
									)
								})}
							</div>
							<div className='history-table-column'>
								<span className='history-table-title sum'>{`Sum`}</span>
								{tran.map(trans => {
									return (
										<h3 className='history-table-text-intable'>
											{trans.quantity}
										</h3>
									)
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
