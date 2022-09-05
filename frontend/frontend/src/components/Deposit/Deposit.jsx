import React, { useEffect, useState } from 'react'
import './Deposit.css'
import axios from 'axios'
import { t } from 'ttag'
import Header from '../Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/slices/userSlice'
import { getUser } from '../redux/slices/selectors'

const Deposit = () => {
	const [data, setData] = useState({
		wallet: '',
		col: '1',
	})
	let [tran, SetTran] = useState([])
	const dispatch = useDispatch()
	const { user } = useSelector(getUser)

	useEffect(() => {
		getTran()
	}, [])

	const getTran = async () => {
		try {
			let response = await axios.get('/api/trans_get_output')
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
					dispatch(setUser(result))
				})

				if (user.wallet !== null) {
					setData({
						wallet: user.wallet,
						col: 1,
					})
				} else {
					setData({
						wallet: '',
						col: 1,
					})
				}
			} catch (e) {
				console.log(e)
			}
		}
		getPosts()
	}, [user.id])

	const handleCopy = () => {
		navigator.clipboard.writeText(user.wallet)
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
				<motion.div
					className='deposit-wrapper'
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'linear', delay: 0.3 }}
				>
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
									<p>
										{user.wallet === null || user.wallet === undefined
											? ' '
											: user.wallet.length > 40
											? `${user.wallet.slice(0, 35)}...`
											: `${user.wallet.slice(0, 35)}`}
									</p>

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
					</div>
				</motion.div>
			</form>
		</div>
	)
}
export default Deposit
