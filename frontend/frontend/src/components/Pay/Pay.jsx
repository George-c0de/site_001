import React, { useEffect, useState } from 'react'
import './Pay.css'
import axios from 'axios'
import { t } from 'ttag'
import Header from '../Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import PaySend from '../modals/PaySend'
import { setUser } from '../redux/slices/userSlice'
import { getUser } from '../redux/slices/selectors'
import { useDispatch, useSelector } from 'react-redux'
import PaySendError from '../modals/ErorrPay'
import CriticalErrorPay from '../modals/CriticalErrorPay'

const Pay = () => {
	const [invalidAmount, setInvalidAmount] = useState(false)
	const [invalidWallet, setInvalidWallet] = useState(false)
	let [openModal, setOpenModal] = useState(false)
	let [openModalError, setOpenModalError] = useState(false)
	let [openModalCrtError, setOpenModalCrtError] = useState(false)

	const dispatch = useDispatch()
	const { user } = useSelector(getUser)

	const [data, setData] = useState({
		wallet_input: '',
		col: '',
	})
	console.log(2)
	let [tran, SetTran] = useState([])

	const getTran = async () => {
		try {
			let response = await axios.get('/api/trans_get_output')
			if (response.data.length > 0) {
				SetTran(response.data)
			} else {
				SetTran([0])
			}
		} catch (e) {
			console.log(e.response)
		}
	}
	useEffect(() => {
		getTran()
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
					if (user.id == '') dispatch(setUser(result))
				})
				if (user.wallet_input !== null) {
					setData({
						wallet_input: user.wallet_input,
						col: '',
					})
				} else {
					setData({
						wallet_input: '',
						col: '',
					})
				}
			} catch (e) {}
		}
		getPosts()
	}, [user.id])

	const handleCopyInTable = id => {
		navigator.clipboard.writeText(tran[id].txid)
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (data.col < 1 || data.col > user.money || data.col === '') {
			setInvalidAmount(true)
		} else {
			setInvalidAmount(false)
		}
		if (data.wallet_input === '') {
			setInvalidWallet(true)
		} else {
			setInvalidWallet(false)
		}

		if (!invalidAmount && !invalidWallet && data.col.length > 0) {
			try {
				setInvalidWallet(false)
				setInvalidAmount(false)

				setData({
					...data,
					col: '',
				})
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
					.catch(function (error) {
						console.log(error.response)
						console.log(error.response.status)
						setOpenModal(false)
						if (error.response.status == 400) {
							console.log('OPEN1')
							setOpenModalCrtError(true)
						} else if (error.response.status == 401) {
							console.log('OPEN2')
							setOpenModalError(true)
						} else {
							console.log('OPEN3')
							setOpenModal(true)
						}
					})
			} catch (e) {
				if (e.response.status === 200) {
					data.col = 1
				} else {
					console.log('Error')
				}
			}
		}
	}
	const hundSum = (e, name) => {
		if (name == 'col') e.target.value = e.target.value.replace(/[^\d.]/g, '')
		if (name == 'wallet_input') {
			e.target.value = e.target.value.replace(/[^0-9A-Za-z]/g, '')
		}

		setData({
			...data,
			[name]: e.target.value,
		})
	}

	return (
		<div className='homepage-wrapper'>
			<div className='main_container'>
				<Header />
				<form onSubmit={handleSubmit}>
					<motion.div
						className='pay-wrapper'
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'linear', delay: 0.3 }}
					>
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
									className={`pay-sum-inp-pay ${
										invalidAmount ? 'pay-invalid-inp' : ''
									}`}
									name='col'
								/>
								<span className='pay-input-info'>{t`Fee - 1%, min 1 USD`}</span>
							</div>
							<div className='pay-input'>
								<label htmlFor='address-input'>{t`Withdrawal wallet`}</label>
								<input
									onChange={e => hundSum(e, 'wallet_input')}
									type='text'
									className={`pay-sum-inp-pay ${
										invalidWallet ? 'pay-invalid-inp' : ''
									}`}
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
						<button
							type={'submit'}
							className={`pay-button ${
								+user.money >= +data.col &&
								data.col.length > 0 &&
								data.wallet_input.length > 0 &&
								'pay-button-active'
							}`}
							disabled={
								+user.money < +data.col ||
								data.col.length == 0 ||
								data.wallet_input.length == 0
							}
						>{t`PAYOUT`}</button>
						{tran[0]?.time && (
							<div className='deposit-history-wrapper'>
								<span className='deposit-history-title'>{t`TRANSACTION HISTORY`}</span>
								<div className='deposit-history-table'>
									<div className='history-table-column'>
										<span className='history-table-title'>{t`Time`}</span>
										{tran.map(trans => {
											return (
												<h3
													className={`history-table-text-intable ${
														+trans.quantity <= 0 ? 'red' : 'green'
													}`}
												>
													{trans.time}
												</h3>
											)
										})}
									</div>
									<div className='history-table-column'>
										<span className='history-table-title'>{t`Date`}</span>
										{tran.map(trans => {
											return (
												<h3
													className={`history-table-text-intable ${
														+trans.quantity <= 0 ? 'red' : 'green'
													}`}
												>
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
												<h3
													className={`history-table-text-intable ${
														+trans.quantity <= 0 ? 'red' : 'green'
													}`}
												>
													{trans.txid}
												</h3>
											)
										})}
									</div>

									<div className='history-table-column history-table-column-mobile'>
										<span className='history-table-title'>Txid</span>
										{tran &&
											tran.map((trans, id) => {
												return (
													<h3
														className={`history-table-text-intable ${
															+trans.quantity <= 0 ? 'red' : 'green'
														}`}
													>
														{trans && trans.txid.slice(0, 20)}
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
										{tran &&
											tran.map((trans, id) => {
												console.log(trans)
												console.log(trans.sum)
												return (
													<h3
														className={`history-table-text-intable ${
															+trans.quantity <= 0 ? 'red' : 'green'
														}`}
													>
														{trans && trans?.txid.slice(0, 10)}
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
											console.log(+trans.quantity > 0)
											console.log(
												+trans.quantity > 0
													? `+${trans.quantity}`
													: trans.quantity
											)
											return (
												<h3
													className={`history-table-text-intable ${
														+trans.quantity <= 0 ? 'red' : 'green'
													}`}
												>
													{+trans.quantity > 0
														? `+${trans.quantity}`
														: trans.quantity}
												</h3>
											)
										})}
									</div>
								</div>
							</div>
						)}
					</motion.div>
				</form>
			</div>
			{openModal && <PaySend setOpenModal={setOpenModal} />}
			{openModalError && <PaySendError setOpenModal={setOpenModalError} />}
			{openModalCrtError && (
				<CriticalErrorPay setOpenModal={setOpenModalCrtError} />
			)}
		</div>
	)
}

export default Pay
