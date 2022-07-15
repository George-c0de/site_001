import React, { useRef } from 'react';

// Images
import satoshi from '../../Ảnh Pokemon Dự Trù/123133.svg';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import './UserId.css';

export const UserId = ({ note }) => {
  const linkRef = useRef();

  const handleCopy = () => {
    navigator.clipboard.writeText(linkRef.current?.innerText);
  }

  return (
    <div className="user-info-container">
      <span className="user-id">User Id-{ note?.id }</span>
      <div className='user-info-wrapper'>
        <ul className="user-info">
          <li>Balance:{ note?.money }</li>
          <li>Cards profit: { note?.money }</li>
          <li>Referal profit: { note?.line_1 + note?.line_2 + note?.line_3 }</li>
          <li>Link for invitation { note?.referral_link }</li>

          <span className="link-invitation" ref={linkRef}>
            { note?.referral_link }
            <FontAwesomeIcon icon={ faCopy } className='copy-icon' onClick={ handleCopy }/>
          </span>

          <div className='user-info-buttons'>
            <button className="yellow-btn">Deposit</button>
            <button className="yellow-btn">Withdraw</button>
          </div>
        </ul>

        <img className="satoshi" src={ satoshi } alt=""/>
      </div>
    </div>
  )
}
