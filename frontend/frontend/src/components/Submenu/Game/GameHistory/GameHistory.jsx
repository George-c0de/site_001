import React, {  useState } from 'react'
import './GameHistory.css'
import axios from 'axios'
import { t } from 'ttag'
import Starlet from '../../../../assets/starlet.svg'
import Lightning from '../../../../assets/lightning.svg'
import { motion } from 'framer-motion'

export const GameHistory = ({ history }) => {
	const [showMore, setShowMore] = useState(false)

	return (
		<motion.div
			className='game-history'
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'linear', delay: 0.8 }}
		>
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
						{history.oneq[2] > 0 ? `${history.oneq[2]}` : `${history.oneq[2]}`}
					</span>
				</div>
				{history.two[0] !== 0 && (
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
							{history.two[2] > 0 ? `${history.two[2]}` : `${history.two[2]}`}
						</span>
					</div>
				)}
				{history.the[0] !== 0 && (
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
							{history.the[2] > 0 ? `${history.the[2]}` : `${history.the[2]}`}
						</span>
					</div>
				)}
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
									? `${history.oneq1[2]}`
									: `${history.oneq1[2]}`}
							</span>
						</div>
						{history.two1[0] !== 0 && (
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
										? `${history.two1[2]}`
										: `${history.two1[2]}`}
								</span>
							</div>
						)}
						{history.the1[0] !== 0 && (
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
										? `${history.the1[2]}`
										: `${history.the1[2]}`}
								</span>
							</div>
						)}
						{history.oneq2[0] !== 0 && (
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
										? `${history.oneq2[2]}`
										: `${history.oneq2[2]}`}
								</span>
							</div>
						)}
						{history.two2[0] !== 0 && (
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
										? `${history.two2[2]}`
										: `${history.two2[2]}`}
								</span>
							</div>
						)}
						{history.the2[0] !== 0 && (
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
										? `${history.the2[2]}`
										: `${history.the2[2]}`}
								</span>
							</div>
						)}
					</>
				)}
			</div>
			{!showMore && history.oneq1[0] !== 0 && (
				<div>
					<p
						className='history-table-text'
						onClick={() => setShowMore(true)}
					>{t`Show more`}</p>
				</div>
			)}

			{/* {<span className='game-history-more'></span>} */}
		</motion.div>
	)
}
