import React, {useEffect, useRef, useState} from 'react';

// Images
import satoshi from '../../Ảnh Pokemon Dự Trù/123133.svg';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import './UserId.css';
import {t} from "ttag";
import {useNavigate} from "react-router-dom";
import axios from "axios";


export const UserId = ({ note }) => {
  const linkRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
            fetchPosts()
        }, [])
  const [user,setUser] = useState({
    "id": 0,
            "money": "0.00",
            "referral_link": "",
            "referral_amount": "",
            "missed_amount": "",
            "wallet": null,
            "line_1": null,
            "line_2": null,
            "line_3": null,
            "max_card": 0,
            "admin_or": false,
            "user": 0
  })
  async function fetchPosts() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user')
                setUser(response.data)
            } catch (e) {
            }

        }
  const handleCopy = () => {
    navigator.clipboard.writeText(linkRef.current?.innerText);
  }
  const Deposit = () => {
    navigate("/home/deposit");
  };
  const Withdraw = () => {
    navigate("/home/pay");
  };
  return (
    <div className="user-info-container">
      <span className="user-id">{t`User Id`}-{ user?.id }</span>
      <div className='user-info-wrapper'>
        <ul className="user-info">
          <li>{t`Balance`}: { user?.money }</li>
          <li>{t`Cards profit`}: { user?.money }</li>
          <li>{t`Referal profit`}: { user?.line_1 + user?.line_2 + user?.line_3 }</li>
          <li>{t`Link for invitation`} </li>

          <span className="link-invitation" ref={linkRef}>
            { user?.referral_link }
            <FontAwesomeIcon icon={ faCopy } className='copy-icon' onClick={ handleCopy }/>
          </span>

          <div className='user-info-buttons'>
            <button onClick={Deposit} className="yellow-btn">{t`Deposit`}</button>
            <button onClick={Withdraw} className="yellow-btn">{t`Withdraw`}</button>
          </div>
        </ul>

        <img className="satoshi" src={ satoshi } alt=""/>
      </div>

    </div>
  )
}
