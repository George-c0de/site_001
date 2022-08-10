import React, { useEffect, useState } from 'react'
import './Pay.css'
import axios from 'axios'
import { t } from 'ttag'
import Header from '../Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const Pay = () => {
	const [state_input, SetState] = useState(true)
	const [firstRender, setFirstRender] = useState(false)
	const [data, setData] = useState({
		wallet_input: '',
		col: '',
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
			if (response.data.length > 0) {
				SetTran(response.data)
			} else {
				SetTran([0])
			}
		} catch (e) {}
	}
	useEffect(() => {
		setFirstRender(true)
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
					setMax(result.money)
					setWallet(result.wallet_input)
				})
				if (user.wallet_input !== null) {
					setData({
						wallet_input: user.wallet_input,
						col: 1,
					})
					SetState(false)
				} else {
					setData({
						wallet_input: '',
						col: 1,
					})
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

	const handleCopyInTable = id => {
		navigator.clipboard.writeText(tran[id].txid)
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (data.col < 1 || data.col > user.money) {
			console.log('Error')
		} else if (data.wallet_input === '') {
			console.log('Error')
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
					console.log('Ok')
				} else {
					console.log('Error')
				}
			}
		}
	}
	const hundSum = (e, name) => {
		e.target.value = e.target.value.replace(/[^\d.]/g, '')
		setData({
			...data,
			[name]: e.target.value,
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
								<label htmlFor='address-input'>
									{t`Enter the amount to withdraw`}:
								</label>
								<input
									onChange={e => hundSum(e, 'col')}
									value={data.col}
									required
									className='pay-sum-inp-pay'
									name='col'
								/>
							</div>
							<div className='pay-input'>
								<label htmlFor='address-input'>{t`Withdrawal wallet`}</label>
								<input
									onChange={e => hundSum(e, 'wallet_input')}
									required
									type='text'
									className='pay-sum-inp-pay'
									name='wallet_input'
									value={data.wallet_input}
									disabled={user.wallet_input !== null}
								/>
								{user.wallet_input == null && (
									<span className='pay-input-info'>
										{t`Specify a wallet for funds withdrawal. Specified wallet is not subject to change`}
									</span>
								)}
							</div>
						</div>
						<button type={'submit'} className='pay-button'>{t`PAYOUT`}</button>
						<div className='deposit-history-wrapper'>
							<span className='deposit-history-title'>{t`TRANSACTION HISTORY`}</span>
							<div className='deposit-history-table'>
								<div className='history-table-column'>
									<span className='history-table-title'>{t`Time`}</span>
									{tran.map(trans => {
										return (
											<h3 className='history-table-text-intable'>
												{trans.time}
											</h3>
										)
									})}
								</div>
								<div className='history-table-column'>
									<span className='history-table-title'>{t`Date`}</span>
									{tran.map(trans => {
										return (
											<h3 className='history-table-text-intable'>
												{trans.data}
											</h3>
										)
									})}
								</div>
								<div className='history-table-column history-table-column-desc'>
									<span className='history-table-title'>
										Txid {t`TRANSACTION`}
									</span>
									{tran.map(trans => {
										return (
											<h3 className='history-table-text-intable'>
												{trans.txid}
											</h3>
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
		</div>
	)
}

export default Pay
