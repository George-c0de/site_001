import React, { useEffect, useState } from 'react'
import './GameHistory.css'
import axios from 'axios'
import { t } from 'ttag'
import Starlet from '../../../../assets/starlet.svg'
import Lightning from '../../../../assets/lightning.svg'

export const GameHistory = ({ history }) => {
	const [data, setData] = useState({})
	const [showMore, setShowMore] = useState(false)
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
				<h3 className='game-history-title'>{t`GAME HISTORY`}</h3>
				<div className='history-table'>
					<div className='history-table-row'>
						<span className='history-table-icon'>
							{history.oneq[2] > 0 ? (
								<img src={Starlet} alt='' />
							) : (
								<img src={Lightning} alt='' />
							)}
						</span>
						<span className='history-table-time'>{history.oneq[1]}</span>
						<span className='history-table-id'>ID {history.oneq[0]}</span>
						<span
							className={`history-table-score ${
								history.oneq[2] > 0 ? 'green' : 'red'
							}`}
						>
							{history.two[2] > 0 ? `+${history.two[2]}` : `-${history.two[2]}`}
						</span>
					</div>
					<div className='history-table-row'>
						<span className='history-table-icon'>
							{history.two[2] > 0 ? (
								<img src={Starlet} alt='' />
							) : (
								<img src={Lightning} alt='' />
							)}
						</span>
						<span className='history-table-time'>{history.two[1]}</span>
						<span className='history-table-id'>ID {history.two[0]}</span>
						<span
							className={`history-table-score ${
								history.two[2] > 0 ? 'green' : 'red'
							}`}
						>
							{history.two[2] > 0 ? `+${history.two[2]}` : `-${history.two[2]}`}
						</span>
					</div>
					<div className='history-table-row'>
						<span className='history-table-icon'>
							{history.the[2] > 0 ? (
								<img src={Starlet} alt='' />
							) : (
								<img src={Lightning} alt='' />
							)}
						</span>
						<span className='history-table-time'>{history.the[1]}</span>
						<span className='history-table-id'>ID {history.the[0]}</span>
						<span
							className={`history-table-score ${
								history.the[2] > 0 ? 'green' : 'red'
							}`}
						>
							{history.the[2] > 0 ? `+${history.the[2]}` : `-${history.the[2]}`}
						</span>
					</div>
					{showMore && (
						<>
							<div className='history-table-row'>
								<span className='history-table-icon'>
									{history.oneq1[2] > 0 ? (
										<img src={Starlet} alt='' />
									) : (
										<img src={Lightning} alt='' />
									)}
								</span>
								<span className='history-table-time'>{history.oneq1[1]}</span>
								<span className='history-table-id'>ID {history.oneq1[0]}</span>
								<span
									className={`history-table-score ${
										history.oneq1[2] > 0 ? 'green' : 'red'
									}`}
								>
									{history.oneq1[2] > 0
										? `+${history.oneq1[2]}`
										: `-${history.oneq1[2]}`}
								</span>
							</div>
							<div className='history-table-row'>
								<span className='history-table-icon'>
									{history.two1[2] > 0 ? (
										<img src={Starlet} alt='' />
									) : (
										<img src={Lightning} alt='' />
									)}
								</span>
								<span className='history-table-time'>{history.two1[1]}</span>
								<span className='history-table-id'>ID {history.two1[0]}</span>
								<span
									className={`history-table-score ${
										history.two1[2] > 0 ? 'green' : 'red'
									}`}
								>
									{history.two1[2] > 0
										? `+${history.two1[2]}`
										: `-${history.two1[2]}`}
								</span>
							</div>
							<div className='history-table-row'>
								<span className='history-table-icon'>
									{history.the1[2] > 0 ? (
										<img src={Starlet} alt='' />
									) : (
										<img src={Lightning} alt='' />
									)}
								</span>
								<span className='history-table-time'>{history.the1[1]}</span>
								<span className='history-table-id'>ID {history.the1[0]}</span>
								<span
									className={`history-table-score ${
										history.the1[2] > 0 ? 'green' : 'red'
									}`}
								>
									{history.the1[2] > 0
										? `+${history.the1[2]}`
										: `-${history.the1[2]}`}
								</span>
							</div>
							<div className='history-table-row'>
								<span className='history-table-icon'>
									{history.oneq2[2] > 0 ? (
										<img src={Starlet} alt='' />
									) : (
										<img src={Lightning} alt='' />
									)}
								</span>
								<span className='history-table-time'>{history.oneq2[1]}</span>
								<span className='history-table-id'>ID {history.oneq2[0]}</span>
								<span
									className={`history-table-score ${
										history.oneq2[2] > 0 ? 'green' : 'red'
									}`}
								>
									{history.oneq2[2] > 0
										? `+${history.oneq2[2]}`
										: `-${history.oneq2[2]}`}
								</span>
							</div>
							<div className='history-table-row'>
								<span className='history-table-icon'>
									{history.two2[2] > 0 ? (
										<img src={Starlet} alt='' />
									) : (
										<img src={Lightning} alt='' />
									)}
								</span>
								<span className='history-table-time'>{history.two2[1]}</span>
								<span className='history-table-id'>ID {history.two2[0]}</span>
								<span
									className={`history-table-score ${
										history.two2[2] > 0 ? 'green' : 'red'
									}`}
								>
									{history.two2[2] > 0
										? `+${history.two2[2]}`
										: `-${history.two2[2]}`}
								</span>
							</div>
							<div className='history-table-row'>
								<span className='history-table-icon'>
									{history.the2[2] > 0 ? (
										<img src={Starlet} alt='' />
									) : (
										<img src={Lightning} alt='' />
									)}
								</span>
								<span className='history-table-time'>{history.the2[1]}</span>
								<span className='history-table-id'>ID {history.the2[0]}</span>
								<span
									className={`history-table-score ${
										history.the2[2] > 0 ? 'green' : 'red'
									}`}
								>
									{history.the2[2] > 0
										? `+${history.the2[2]}`
										: `-${history.the2[2]}`}
								</span>
							</div>
						</>
					)}
				</div>
				{!showMore && (
					<div>
						<p
							className='history-table-text'
							onClick={() => setShowMore(true)}
						>{t`Show more`}</p>
					</div>
				)}

				<span className='game-history-more'></span>
			</div>
		</>
	)
}
