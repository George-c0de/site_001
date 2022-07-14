import britain from '../../../Ảnh Pokemon Dự Trù/gb-1.svg';
import support from '../../../Ảnh Pokemon Dự Trù/супорт.svg';
import './Lang.css';

export const Lang = ({ isActive }) => (
  <div className={ isActive ? "site-main" : "site-main_active" }>
    <img
      src={ britain }
      className={
        isActive ? "english-icon-mainpage" : "english-icon-mainpage_active"
      }
      alt=""
    />

    <img
      src={ support }
      className={
        isActive ? "support-icon-mainpage" : "support-icon-mainpage_active"
      }
      alt=""
    />
  </div>
)
