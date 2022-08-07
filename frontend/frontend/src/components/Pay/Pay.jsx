import React, { useEffect, useState } from 'react'
import './Pay.css'
import axios from 'axios'
import { t } from 'ttag'
import Header from '../Header/Header'

const Pay = () => {
	const [state_input, SetState] = useState(true)
	const [data, setData] = useState({
		wallet_input: '',
		col: 0,
	})
	const [maxi, setMax] = useState(1)
	let [tran, SetTran] = useState([])
	let [user, setUser] = useState({
		id: 0,
		money: 0,
		referral_link: '',
		referral_amount: '',
		missed_amount: '',
		wallet_input: null,
		line_1: null,
		line_2: null,
		line_3: null,
		max_card: 0,
		admin_or: false,
		user: 0,
	})
	let [wallet, setWallet] = useState(null)
	useEffect(() => {
		getTran()
	}, [])
	const getTran = async () => {
		try {
			let response = await axios.get('/api/trans_get_input')
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
		} catch (e) {
			console.log(e)
			console.log(data)
		}
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
						wallet_input: data.data.wallet_input,
						line_1: data.data.line_1,
						line_2: data.data.line_2,
						line_3: data.data.line_3,
						max_card: data.data.max_card,
						admin_or: data.data.admin_or,
						user: data.data.user,
					}
					setUser(result)
					console.log(result.wallet_input)
					setMax(result.money)
					setWallet(result.wallet_input)
				})
				if (user.wallet_input !== null) {
					setData({
						wallet_input: user.wallet_input,
						col: 1,
					})
					console.log(user.wallet_input)
					SetState(false)
				} else {
					setData({
						wallet_input: '',
						col: 1,
					})
					console.log('yes')
					SetState(true)
				}
			} catch (e) {}
		}
		getPosts()
	}, [user.id])

	const handleSum = e => {
		setData({
			wallet_input: data.wallet_input,
			col: e.target.value,
		})
		if (Number(data.col) > Number(user.money)) {
			e.target.value = Number(user.money)
			setData({
				wallet_input: data.wallet_input,
				col: Number(user.money),
			})
		} else if (Number(data.col) < 1) {
			e.target.value = 1
			setData({
				wallet_input: data.wallet_input,
				col: 1,
			})
		} else {
			setData({
				wallet_input: data.wallet_input,
				col: e.target.value,
			})
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (data.col < 1 || data.col > user.money) {
			console.log(data.col)
			console.log(user.money)
			alert('Error')
		} else if (data.wallet_input === '') {
			console.log(data.wallet_input)
			alert('Error')
		} else {
			try {
				axios
					.post(
						'/api/dis',
						{
							wallet_input: data.wallet_input,
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
	const hundSum = (e, name) => {
		// console.log(state_input)
		// if (state_input) {
		// 	setData({
		// 		wallet_input: e.target.value,
		// 		col: data.col,
		// 	})
		// } else {
		// 	e.target.value = ''
		// }
		setData({
			...data,
			[name]: e.target.value
		})
	}

	// ИЗМЕНЕНЫ NAME У ИНПУТОВ

	return (
		<div className='homepage-wrapper'>
			<div className='main_container'>
				<Header />
				<form onSubmit={handleSubmit}>
					<div className='pay-wrapper'>
						<div className='pay-title-wrapper'>
							<h1 className='pay-title'>{t`Withdrawal`}</h1>
							<span className='pay-subtitle'>{t`Available for payout`}:</span>
							<span className='pay-money'>{user.money}$</span>
						</div>
						<div className='pay-inputs-wrapper'>
							<div className='pay-input'>
								<label htmlFor='address-input'>{t`Top - up amount`}:</label>
								<input
									onChange={e => hundSum(e, 'col')}
									value={data.col}
									required
									className='pay-sum-inp-pay'
									name='col'
								/>
								<span className='deposit-deposit-info'>
									{t`TRANSACTION NOTICE`}
								</span>
							</div>
							<div className='pay-input'>
								<label htmlFor='address-input'>Адрес вывода:</label>
								<input
									onChange={e => hundSum(e, 'wallet_input')}
									required
									type='text'
									className='pay-sum-inp-pay'
									name='wallet_input'
									value={data.wallet_input}
								/>
								<span className='pay-input-info'>
									Кошелек для вывода изменить будет нельзя
								</span>
							</div>
						</div>
						<button type={'submit'} className='pay-button'>{t`PAYOUT`}</button>
						<div className='pay-history-wrapper'>
							<span className='pay-history-title'>{t`TRANSACTION HISTORY`}</span>
							<div className='pay-history-table'>
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
		</div>
	)
}

export default Pay
