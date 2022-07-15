import React, { useState } from 'react';

// Images
import britain from '../../../Ảnh Pokemon Dự Trù/gb-1.svg';
import russia from '../../../assets/russia.svg';
import france from '../../../assets/france.svg';
import germany from '../../../assets/germany.svg';
import italy from '../../../assets/italy.svg';
import portugal from '../../../assets/portugal.svg';
import spain from '../../../assets/spain.svg';
import brazil from '../../../assets/brazil.svg';
import argentina from '../../../assets/argentina.svg';
import india from '../../../assets/india.svg';
import support from '../../../Ảnh Pokemon Dự Trù/супорт.svg';

import './Lang.css';

const languages = {
  'britain': britain,
  'russia': russia,
  'france': france,
  'germany': germany,
  'italy': italy,
  'portugal': portugal,
  'spain': spain,
  'brazil': brazil,
  'argentina': argentina,
  'india': india
}

const languagesShort = {
  'britain': 'en',
  'russia': 'ru',
  'france': 'fr',
  'germany': 'de',
  'italy': 'it',
  'portugal': 'pt',
  'spain': 'es',
  'brazil': 'br',
  'argentina': 'ar',
  'india': 'in'
}

export const Lang = ({ isActive }) => {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('britain');

  const handleOpen = () => {
    setOpen(!open);
  }

  const handleOpenList = (e) => {
    const lang = e.target.dataset.lang;
    setOpen(!open);
    setCurrentLang(lang);
  }

  const setLocate = (locale) => (ev) => {
    ev.preventDefault();
    // saveLocate(locale);
    window.location.reload();
  }

  return (
    <div className={ isActive ? "site-main" : "site-main_active" }>
      <img
        src={ languages[currentLang] }
        className={ open ? 'lang-icon-preview hidden' : 'lang-icon-preview' }
        alt=""
        onClick={ handleOpen }
      />
      <ul className={ open ? 'lang-list' : 'lang-list hidden' } onClick={ handleOpenList }>
        { Object.entries(languages).map((lang) => {
          return (<li>
            <img
              src={ lang[1] }
              className={
                isActive ? "lang-icon" : "lang-icon_active"
              }
              data-lang={ lang[0] }
              onClick={ setLocate(languagesShort[lang[0]]) }
              alt=""
            />
          </li>)
        }) }
      </ul>

      <img
        src={ support }
        className={
          isActive ? "support-icon-mainpage" : "support-icon-mainpage_active"
        }
        alt=""
      />
    </div>
  )
}
