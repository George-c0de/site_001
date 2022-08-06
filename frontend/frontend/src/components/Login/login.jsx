import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'
import { saveLocale } from '../../i18nInit'
//Images
import logo from '../../Ảnh Pokemon Dự Trù/логотип.svg'
import pikachu_pokeball from '../../Ảnh Pokemon Dự Trù/pikachu-authorization.png'
// import { reCaptchaExecute } from 'recaptcha-v3-react-function-async'
// Pages
import { Lang } from '../MainPage/Lang/Lang'
import Needle from '../../assets/left-needle .svg'
import { t } from 'ttag'

const Signup = () => {
	const [typeAuthorization, setTypeAuthorization] = useState('sign')
	const [isActive, setActive] = useState(false)
	const [invalidPassword, setInvalidPassword] = useState(false)
	const [invalidDataLogin, setInvalidDataLogin] = useState(false)
	const [invalidEmail, setInvalidEmail] = useState(false)
	const [data, setData] = useState({
		email: '',
		password: '',
		password1: '',
	})
	const navigate = useNavigate()
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()

		console.log(typeAuthorization)
		if (typeAuthorization === 'login') {
			try {
				let data2 = 200
				data2 = await axios.post('/api/login', data).catch(function (error) {
					if (error.response) {
						data2 = error.response.status
					}
				})
				if (data2.data === 200) {
					navigate('/home/game') //after registering navigate to login page
				}
			} catch (error) {
				console.log(error)
			}
		}

		if (typeAuthorization === 'sign') {
			if (
				!data.email
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					)
			) {
				setInvalidEmail(true)
			} else {
				setInvalidEmail(false)
			}
			if (data.password.length < 8 || data.password !== data.password2) {
				setInvalidPassword(true)
			} else {
				setInvalidPassword(false)
			}
			if (!invalidPassword && !invalidEmail) {
				try {
					const { data: res } = await axios.post('/api/register', data, {
						headers: { 'Content-Type': 'application/json' },
					})
					console.log(res.data)
					navigate('/home/game') //after registering navigate to login page
					console.log(res.message)
				} catch (error) {
					console.log(error)
				}
			}
		}
	}
	return (
		<div className='login_container'>
			<div className='header-authorization'>
				<img src={logo} alt='' className='nav__logo' />
			</div>
			<div className='authorization__container'>
				<div className='authorization__menu'>
					{(typeAuthorization === 'login' || typeAuthorization === 'sign') && (
						<div className='authorization__nav'>
							<p
								className={`authorization__link ${
									typeAuthorization === 'login'
										? 'authorization__link-active'
										: ''
								}`}
								onClick={() => setTypeAuthorization('login')}
							>
								{t`Log In`}
							</p>
							<span className='separator'></span>
							<p
								className={`authorization__link ${
									typeAuthorization === 'sign'
										? 'authorization__link-active'
										: ''
								}`}
								onClick={() => setTypeAuthorization('sign')}
							>
								{t`Sign Up`}
							</p>
						</div>
					)}
					{typeAuthorization === 'login' && (
						<form className='authorization__form' onSubmit={handleSubmit}>
							<input
								type='text'
								className={`authorization__input ${
									invalidDataLogin ? 'authorization__input-invalid' : ''
								}`}
								placeholder={t`Email`}
								onChange={handleChange}
								name='email'
								value={data.email}
							/>
							<input
								type='password'
								className={`authorization__input ${
									invalidDataLogin ? 'authorization__input-invalid' : ''
								}`}
								placeholder={t`Password`}
								name='password'
								onChange={handleChange}
								value={data.password}
							/>
							<p
								className='authorization-reset'
								onClick={() => setTypeAuthorization('reset')}
							>
								Restore password?
							</p>
							<button className='authorization__button' type='submit'>
								Further
							</button>
						</form>
					)}
					{typeAuthorization === 'sign' && (
						<form className='authorization__form' onSubmit={handleSubmit}>
							<input
								type='text'
								className={`authorization__input ${
									invalidEmail ? 'authorization__input-invalid' : ''
								}`}
								placeholder={t`Email`}
								name='email'
								onChange={handleChange}
								value={data.email}
							/>
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
							<button className='authorization__button' type='submit'>
								Further
							</button>
						</form>
					)}

					{typeAuthorization === 'reset' && (
						<>
							<p className='reset__link'>Enter your email</p>
							<form className='authorization__form' onSubmit={handleSubmit}>
								<input
									type='text'
									className={`authorization__input ${
										invalidEmail ? 'authorization__input-invalid' : ''
									}`}
									placeholder='E-mail:'
									name='email'
									onChange={handleChange}
									value={data.email}
								/>
								<button className='authorization__button' type='submit'>
									Further
								</button>
							</form>
						</>
					)}
				</div>
				<div className='authorization__pikachu-wrapper'>
					<img src={pikachu_pokeball} className='pikachu-pokeball' alt='' />
				</div>
			</div>
			<Lang />
		</div>
	)
}
export default Signup
