import React from 'react'
import logo from '../../assets/header/logo.svg'
import { t } from 'ttag'
import { useNavigate, useParams } from 'react-router-dom'
import { Lang } from '../Lang/Lang'
import axios from 'axios'
import './reset.css'

const Resetpass = () => {
	const params = useParams()
	console.log(params)
	const [data, setData] = React.useState({
		password1: '',
		password2: '',
		uid: params.uid,
		token: params.token,
	})
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value })
	}
	const navigate = useNavigate()
	const [invalidPassword, setInvalidPassword] = React.useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		if (data.password1.length < 8 || data.password1 !== data.password2) {
			setInvalidPassword(true)
		} else {
			navigate('/login')
			setInvalidPassword(false)
		}

		if (!invalidPassword && data.password1 > 0) {
			try {
				const { data: res } = await axios.post('/api/set_new/', data, {
					headers: { 'Content-Type': 'application/json' },
				})
				console.log(data)
				console.log(res.data)
				// navigate('/home') //after registering navigate to login page
				console.log(res.message)
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<div className='login_container'>
			<div className='navbar-container'>
				<nav className='navbar'>
					<img src={logo} className='logo-tokemon reset-logo-tokemon' alt='' />
				</nav>
			</div>
			<div className='reset__block'>
				<h1 className='reset__title'>{t`Enter a new password`}</h1>
				<form action='#' onSubmit={handleSubmit}>
					<input
						className={`authorization__input ${
							invalidPassword ? 'authorization__input-invalid' : ''
						}`}
						placeholder={t`Password`}
						name='password1'
						type='password'
						onChange={handleChange}
						value={data.password1}
					/>
					<input
						type='password'
						name='password2'
						className={`authorization__input ${
							invalidPassword ? 'authorization__input-invalid' : ''
						}`}
						placeholder={t`Confirm Password`}
						onChange={handleChange}
						value={data.password2}
					/>
					{invalidPassword && (
						<div className='input__invalid-text'>
							<p>You must enter more than 8 characters</p>
						</div>
					)}
					<button className='authorization__button reset-btn' type='submit'>
						{t`Confirm your new password`}
					</button>
				</form>
			</div>
			<Lang />
		</div>
	)
}

export default Resetpass
