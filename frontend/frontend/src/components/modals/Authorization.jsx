import React from 'react'
import './modals.css'
import { t } from 'ttag'
import { Link } from 'react-router-dom'
const Authorization = () => {
	return (
		<div className={`subscriibe-wrapper buy-wrapper`}>
			<div className='subscriibe-block'>
				<div className='buy-btns-wrapper btn-modal'>
					<Link to='/login'>
						<p className='authorization-modal-text'>{t`Log in to continue`}</p>
					</Link>
				</div>
			</div>
		</div>
	)
}
export default Authorization
