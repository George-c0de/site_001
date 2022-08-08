import React from 'react'
import logo from '../../Ảnh Pokemon Dự Trù/логотип.svg'
import { t } from 'ttag'
import './reset.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Lang } from '../MainPage/Lang/Lang'
const Resetpass = () => {
	const [data, setData] = React.useState({
		password: '',
		password1: '',
	})
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value })
	}
	const navigate = useNavigate()
	const [invalidPassword, setInvalidPassword] = React.useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		if (data.password.length < 8 || data.password !== data.password1) {
			setInvalidPassword(true)
		} else {	
			navigate('/login')
			setInvalidPassword(false)
		}
	
		// if (!invalidPassword) {
		// 	try {
		// 		const { data: res } = await axios.post('/api/register', data, {
		// 			headers: { 'Content-Type': 'application/json' },
		// 		})
		// 		console.log(res.data)
		// 		navigate('/home') //after registering navigate to login page
		// 		console.log(res.message)
		// 	} catch (error) {
		// 		console.log(error)
		// 	}
		// }
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
						name='password'
						type='password'
						onChange={handleChange}
						value={data.password}
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
