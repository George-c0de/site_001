import React, { useEffect, useState } from 'react'
import './GameHistory.css'
import Game from '../game'
import axios from 'axios'
import { t } from 'ttag'

export const GameHistory = ({ history }) => {
	const [data, setData] = useState({})
	useEffect(() => {
		getUsername()
	}, [])
	let getUsername = async () => {
		const res = await axios.get('/api/user')
		setData(res.data)
	}
	return (
		<>
			<div className='game-history'>
				<span>{t`GAME HISTORY`}</span>
				<div className='history-table'>
					<div className='history-table-row'>
						<span className='history-table-icon'>()</span>
						<span className='history-table-time'>{history.oneq[1]}</span>
						<span className='history-table-id'>ID {history.oneq[0]}</span>
						<span className='history-table-score green'>
							{history.oneq[2]}
						</span>
					</div>
					<div className='history-table-row'>
						<span className='history-table-icon'>()</span>
						<span className='history-table-time'>{history.two[1]}</span>
						<span className='history-table-id'>ID {history.two[0]}</span>
						<span className='history-table-score red'>{history.two[2]}</span>
					</div>
					<div className='history-table-row'>
						<span className='history-table-icon'>()</span>
						<span className='history-table-time'>{history.the[1]}</span>
						<span className='history-table-id'>ID {history.the[0]}</span>
						<span className='history-table-score green'>{history.the[2]}</span>
					</div>
				</div>
				<span className='game-history-more'></span>
			</div>
		</>
	)
}
