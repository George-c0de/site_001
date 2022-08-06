import React from 'react'
import logo from '../../Ảnh Pokemon Dự Trù/логотип.svg'
import { t } from 'ttag'
const Resetpass = () => {
	const [data, setData] = React.useState({
		password: '',
		password1: '',
	})
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value })
	}
	const [invalidPassword, setInvalidPassword] = React.useState(false)

	return (
		<div className='login_container'>
			<div className='navbar-container'>
				<nav className='navbar'>
					<img src={logo} className='logo-tokemon' alt='' />
				</nav>
			</div>
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
		</div>
	)
}

export default Resetpass
