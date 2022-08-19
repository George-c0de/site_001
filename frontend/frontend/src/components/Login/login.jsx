import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'
import logo from '../../assets/header/logo.svg'
import pikachu_pokeball from '../../Ảnh Pokemon Dự Trù/pikachu-authorization.png'
import { Lang } from '../Lang/Lang'
import { t } from 'ttag'
import { get } from '../../cookie'
import { saveLocale } from '../../utm'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

let data2

try {
	axios.get('/api/login').catch(function (error) {
		if (error.response) {
			data2 = error.response.status
		}
	})
} catch (error) {}

const Signup = () => {
	const navigate = useNavigate()
	const params = useParams()
	const [typeAuthorization, setTypeAuthorization] = useState('login')
	const [invalidPassword, setInvalidPassword] = useState(false)
	const [invalidDataLogin, setInvalidDataLogin] = useState(false)
	const [invalidEmail, setInvalidEmail] = useState(false)
	const [invalidEmailReset, setInvalidEmailReset] = useState(false)
	const [activeCaptcha, setActiveCaptcha] = useState(false)
	const [firstRender, setFirstRender] = useState(true)
	const [coincidence, setCoincidence] = useState(false)
	const [exist, setExist] = useState(false)
	const [data3, setData3] = useState()

	const [data, setData] = useState({
		email: '',
		password1: '',
		password2: '',
		utm: get('utm'),
	})

	React.useEffect(() => {
		if (!document.cookie.includes('firstRun=true')) setTypeAuthorization('sign')
		if (firstRender) {
			document.cookie = 'firstRun=true'
			try {
				axios.get('/api/login').catch(function (error) {
					if (error.response) {
						setData3(error.response.status)
					}
				})
			} catch (error) {
				console.log(error)
			}
		}
		if (firstRender && params.utm) {
			setTypeAuthorization('sign')
		}
		setFirstRender(false)
		if (get('utm') == null) {
			saveLocale(params.utm)
		}
		setData({
			email: data.email,
			password1: data.password1,
			password2: data.password2,
			utm: get('utm'),
		})
	}, [])
	setTimeout(() => {
		if (data3 === 501) {
			navigate('/home')
		}
	}, 3000)

	const [emailReset, setEmailReset] = useState('')
	const [letterSent, setLetterSent] = useState(false)

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (typeAuthorization === 'login') {
			let validData = {
				email: data.email,
				password: data.password1,
			}
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
			if (data.password1.length < 8) {
				setInvalidDataLogin(true)
			} else {
				setInvalidDataLogin(false)
			}

			if (
				!invalidPassword &&
				!invalidDataLogin &&
				data.password1.length > 0 &&
				data.email.length > 0
			)
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
						window.location.assign('https://tokemon.games/home')
					}
				} catch (error) {
					setInvalidDataLogin(true)
					setInvalidEmail(true)
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
			if (data.password1 !== data.password2 || data.password1.length < 8) {
				setCoincidence(true)
				setInvalidPassword(true)
			} else {
				setCoincidence(false)
				setInvalidPassword(false)
			}
			// if (data.password1.length < 8) setInvalidPassword(true)
			// else setInvalidPassword(false)

			if (
				!invalidPassword &&
				!invalidEmail &&
				data.password1.length > 0 &&
				data.email.length > 0 &&
				activeCaptcha
			) {
				setData({
					username: data.username,
					email: data.email,
					password1: data.password1,
					password2: data.password2,
					utm: get('utm'),
				})
				try {
					let validObj = {
						email: data.email,
						password1: data.password1,
						password2: data.password2,
						utm: data.utm,
					}
					let validData = {
						email: data.email,
						password: data.password1,
					}
					try {
						const { data: res } = await axios.post(`/api/register`, validObj, {
							headers: { 'Content-Type': 'application/json' },
						})
					} catch {
						setExist(true)
					}

					let data2 = 200
					data2 = await axios
						.post('/api/login', validData)
						.catch(function (error) {
							if (error.response) {
								data2 = error.response.status
							}
						})
					if (data2.data === 200) {
						// navigate('/home') //after registering navigate to login page
						window.location.assign('https://tokemon.games/home')
					}
				} catch (error) {
					setInvalidEmail(true)
					setInvalidPassword(true)
				}
			}
		}
		if (typeAuthorization === 'reset') {
			let validData = {
				email: emailReset,
			}
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
				setLetterSent(true)
				try {
					const { data } = axios.post('/api/reset_password/', validData, {
						headers: { 'Content-Type': 'application/json' },
					})
				} catch (e) {}
				setTimeout(() => {
					window.location.reload()
				}, 5000)
			}
		}
	}
	console.log(invalidPassword && !coincidence)
	return (
		<div
			className={`login_container ${
				typeAuthorization === 'reset' ? 'login_container-reset' : ''
			}`}
		>
			<motion.div
				className='header-authorization'
				initial={{ opacity: 0, y: -150 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'linear' }}
			>
				<img src={logo} alt='' className='nav__logo' />
			</motion.div>
			<div className='authorization__container'>
				<motion.div
					className='authorization__menu'
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeIn', delay: 0.45 }}
				>
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
								name='password1'
								onChange={handleChange}
								value={data.password1}
							/>
							{(invalidDataLogin || invalidEmail) && (
								<div className='input__invalid-text'>
									<p>{t`Incorrect email address or password`}</p>
								</div>
							)}
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
							{exist && (
								<div className='input__invalid-text'>
									<p>{t`This email is already registered in the system`}</p>
								</div>
							)}
							<input
								className={`authorization__input ${
									invalidPassword || coincidence
										? 'authorization__input-invalid'
										: ''
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
									invalidPassword || coincidence
										? 'authorization__input-invalid'
										: ''
								}`}
								placeholder={t`Confirm Password`}
								onChange={handleChange}
								value={data.password2}
							/>
							{coincidence && (
								<div className='input__invalid-text'>
									<p>{t`Passwords do not match`}</p>
								</div>
							)}
							{invalidPassword && (
								<div className='input__invalid-text'>
									<p>{t`The password must be at least 8 characters long. Contains letters and symbols`}</p>
								</div>
							)}
							<div className='captcha'>
								<div className='spinner' onClick={() => setActiveCaptcha(true)}>
									<label>
										<input
											type='checkbox'
											className={activeCaptcha ? `captcha-checkbox` : ''}
										/>
										<span className='checkmark'>
											<span>&nbsp;</span>
										</span>
									</label>
								</div>
								<div className='text'>{t`I'm not a robot`}</div>
								<div className='logo'>
									<img src='https://forum.nox.tv/core/index.php?media/9-recaptcha-png/' />
									<p>reCAPTCHA</p>
									<small>Privacy - Terms</small>
								</div>
							</div>
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
				</motion.div>
				<motion.div
					className='authorization__pikachu-wrapper'
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeIn', delay: 0.3 }}
				>
					<img src={pikachu_pokeball} className='pikachu-pokeball' alt='' />
				</motion.div>
			</div>
			<Lang />
		</div>
	)
}
export default Signup
