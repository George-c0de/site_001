import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'
import logo from '../../Ảnh Pokemon Dự Trù/логотип.svg'
import pikachu_pokeball from '../../Ảnh Pokemon Dự Trù/pikachu-authorization.png'
import { Lang } from '../MainPage/Lang/Lang'
import { t } from 'ttag'
import { reCaptchaExecute } from 'recaptcha-v3-react-function-async'

const Signup = () => {
	const navigate = useNavigate()
	const [typeAuthorization, setTypeAuthorization] = useState('login')
	const [invalidPassword, setInvalidPassword] = useState(false)
	const [invalidDataLogin, setInvalidDataLogin] = useState(false)
	const [invalidEmail, setInvalidEmail] = useState(false)
	const [invalidEmailReset, setInvalidEmailReset] = useState(false)
	const [data, setData] = useState({
		email: '',
		password: '',
		password1: '',
	})
	const [emailReset, setEmailReset] = useState('')
	const [letterSent, setLetterSent] = useState(false)

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (typeAuthorization === 'login') {
			let validData = JSON.stringify({
				email: data.email,
				password: data.password,
			})
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

			// try {
			// 	const { data } = axios.post('/api/login', validData, {
			// 		headers: { 'Content-Type': 'application/json' },
			// 	})
			// 	console.log(data)
			// } catch (e) {
			// 	console.log(e.response)
			// }
			try {
				let data2 = 200
				data2 = await axios
					.post('/api/login', validData)
					.catch(function (error) {
						if (error.response) {
							data2 = error.response.status
						}
					})
				if (data2.data === 200) {
					navigate('/home') //after registering navigate to login page
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
			if (data.password.length < 8 || data.password !== data.password1) {
				setInvalidPassword(true)
			} else {
				setInvalidPassword(false)
			}
			console.log(invalidPassword, data.passsword)
			if (
				!invalidPassword &&
				!invalidEmail &&
				data.password.length > 0 &&
				data.email.length > 0
			) {
				let validData = JSON.stringify({
					email: data.email,
					password: data.password,
					password1: data.password1,
				})
				let gtoken = await reCaptchaExecute(
					'6LfvLEkhAAAAAHfamR736TVtumYAmll0Kiy1iqmD',
					'auth'
				)
				// try {
				// 	const response = await axios.post('/api/register', validData, {
				// 		headers: { 'Content-Type': 'application/json' },
				// 	})
				// 	console.log(response)
				// 	navigate('/home')
				// } catch (e) {
				// 	console.log(e.response)
				// }

				try {
					const { data: res } = await axios.post('/api/register', data, {
						headers: { 'Content-Type': 'application/json' },
					})
					console.log(res.data)
					navigate('/home')
					console.log(res.message)
				} catch (error) {
					alert(error.response.data.msg)
				}
			}
		}
		if (typeAuthorization === 'reset') {
			let validData = JSON.stringify({
				email: data.email,
			})
			if (
				!emailReset
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					)
			) {
				setInvalidEmailReset(true)
			} else {
				setInvalidEmailReset(false)
				setInvalidEmail(true)
				setLetterSent(true)
				setTimeout(() => {
					window.location.reload()
				}, 5000)
			}
			// try {
			// 	const { data } = axios.post('/api/login', validData, {
			// 		headers: { 'Content-Type': 'application/json' },
			// 	})
			// 	console.log(data)
			// } catch (e) {
			// 	console.log(e.response)
			// }
		}
	}
	return (
		<div
			className={`login_container ${
				typeAuthorization === 'reset' ? 'login_container-reset' : ''
			}`}
		>
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
									invalidEmail ? 'authorization__input-invalid' : ''
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
								{t`Forgot your password`}
							</p>
							<button className='authorization__button' type='submit'>
								{t`Continue`}
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
								name='password1'
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
								{t`Continue`}
							</button>
						</form>
					)}
					{typeAuthorization === 'reset' && (
						<>
							<p className='reset__link'>{t`Enter your email address to reset your password`}</p>
							<form className='authorization__form' onSubmit={handleSubmit}>
								<input
									type='text'
									className={`authorization__input ${
										invalidEmailReset ? 'authorization__input-invalid' : ''
									}`}
									placeholder={t`Email`}
									name='email'
									onChange={event => setEmailReset(event.target.value)}
									value={emailReset}
								/>
								{letterSent && (
									<p className='reset__text'>{t`Password recovery link was sent to the specified email`}</p>
								)}

								<button className='authorization__button' type='submit'>
									{t`Continue`}
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
