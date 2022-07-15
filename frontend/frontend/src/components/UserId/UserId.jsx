import satoshi from '../../Ảnh Pokemon Dự Trù/123133.svg';
import './UserId.css';

export const UserId = ({ note }) => (
  <div className="user-info-container">
    <span className="user-id">User Id-{ note?.id }</span>
    <div className='user-info-wrapper'>
      <ul className="user-info">
        <li>Balance:{ note?.money }</li>
        <li>Cards profit: { note?.money }</li>
        <li>Referal profit: { note?.line_1 + note?.line_2 + note?.line_3 }</li>
        <li>Link for invitation { note?.referral_link }</li>
        <div className="link-invitation">{ note?.referral_link }</div>
        <div className='user-info-buttons'>
          <button className="yellow-btn">Deposit</button>
          <button className="yellow-btn">Withdraw</button>
        </div>
      </ul>

      <img className="satoshi" src={ satoshi } alt=""/>
    </div>
  </div>
)
