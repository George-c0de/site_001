import captchaImg from '../../Ảnh Pokemon Dự Trù/captcha.jpg'
import React, { useState } from 'react'

const Captcha = props => {
	const [usercapt, setUsercapt] = useState({
		username: '',
	})

	// eslint-disable-next-line
	const [isCorrect, setIsCorrect] = useState(false)

	const characters = 'abc123'

	const sendData = () => {
		props.parentCallback(!isCorrect)
	}

	//Generate string of captcha
	function generateString(length) {
		let result = ''
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	const captcha = generateString(6) // Function called here and save in captcha variable

	let handleChange = e => {
		let name = e.target.name
		let value = e.target.value
		usercapt[name] = value
		setUsercapt(usercapt)
	}

	const onSubmit = () => {
		const element = document.getElementById('succesBTN')
		const inputData = document.getElementById('inputType')
		element.style.cursor = 'wait'
		element.innerHTML = 'Checking...'
		inputData.disabled = true
		element.disabled = true
		const myFunctions = () => {
			if (captcha === usercapt.usercaptname) {
				element.style.backgroundColor = '#3bb19b'
				element.innerHTML = 'Verified'
				element.disabled = true
				element.style.cursor = 'not-allowed'
				inputData.style.display = 'none'
				sendData()
			} else {
				element.style.backgroundColor = 'red'
				element.style.cursor = 'not-allowed'
				element.innerHTML = 'Not Matched'
				element.disabled = true

				const myFunction = () => {
					element.style.backgroundColor = '#3bb19b'
					element.style.cursor = 'pointer'
					element.innerHTML = 'Verify'
					element.disabled = false
					inputData.disabled = false
				}
				setTimeout(myFunction, 3000)
			}
		}
		setTimeout(myFunctions, 3000)
	}

	return (
		<div className='captcha-wrapper'>
			<input
				type='text'
				id='inputType'
				className='captcha-inp'
				placeholder='Enter Captcha'
				name='usercaptname'
				onChange={handleChange}
				autoComplete='off'
			/>

			<div className='captcha-field'>
				<img src={captchaImg} className='captcha-image' alt='' />
				<h4 id='captcha' className='captcha-data'>
					{captcha}
				</h4>
			</div>

			<button
				type='button'
				id='succesBTN'
				onClick={onSubmit}
				className='green_btn captcha-btn'
			>
				Verify
			</button>
		</div>
	)
}
export default React.memo(Captcha)
