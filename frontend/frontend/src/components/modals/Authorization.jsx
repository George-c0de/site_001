import React from 'react'
import './modals.css'
import { t } from 'ttag'
import { Link } from 'react-router-dom'
const Authorization = () => {
	return (
		<div className={`subscriibe-wrapper buy-wrapper`}>
			<div className='subscriibe-block'>
				<p className='buy-text'>{t`Insufficient funds to purchase the card`}</p>
				<div className='buy-btns-wrapper'>
					<Link
						to='/login'
						className='authorization__button subscribe-btn authorization-modal-text'
					>
						{t`log in to continue`}
					</Link>
				</div>
			</div>
		</div>
	)
}
export default Authorization
