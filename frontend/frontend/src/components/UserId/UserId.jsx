import satoshi from '../../Ảnh Pokemon Dự Trù/123133.svg';
import './UserId.css';
import {t} from "ttag";

export const UserId = ({ note }) => (
  <div className="user-info-container">
    <span className="user-id">{t`User Id`}-{ note?.id }</span>
    <div className='user-info-wrapper'>
      <ul className="user-info">
        <li>{t`Balance`}:{ note?.money }</li>
        <li>{t`Cards profit`}: { note?.money }</li>
        <li>{t`Referal profit`}: { note?.line_1 + note?.line_2 + note?.line_3 }</li>
        <li>{t`Link for invitation`} { note?.referral_link }</li>
        <div className="link-invitation"></div>
        <div className='user-info-buttons'>
          <button className="yellow-btn">{t`Deposit`}</button>
          <button className="yellow-btn">{t`Withdraw`}</button>
        </div>
      </ul>

      <img className="satoshi" src={ satoshi } alt=""/>
    </div>
  </div>
)
