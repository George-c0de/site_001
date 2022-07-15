import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../Ảnh Pokemon Dự Trù/логотип.svg';
import human from '../../../Ảnh Pokemon Dự Trù/Чел.svg';
import './Menu.css';
import {t} from "ttag";

export const Menu = ({ isActive, showMenu, showNewMenu, handleLogout }) => (
  <div className='menu'>
    <FontAwesomeIcon
      icon={ faBars }
      className={ isActive ? "icon-menu" : "icon_menu_active" }
      onClick={ showMenu }
    />
    <img
      className={ isActive ? "pokemon-banner" : "pokemon-banner_active" }
      src={ logo }
      alt=""
    />


    <img
      src={ human }
      className={ isActive ? "icon-user" : "icon-user_active" }
      onClick={ showNewMenu }
      alt=""
    />
    <button
      className={ isActive ? "white_btn_in" : "white_btn_in_active" }
      onClick={ handleLogout }
    >
        {t`LOGOUT`}
    </button>
  </div>
)
