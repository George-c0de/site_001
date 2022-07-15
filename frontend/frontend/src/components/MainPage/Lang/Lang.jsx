import React, { useState, useContext } from 'react';

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
import { LangContext } from '../../../context/LangContext';

const languages = {
  'en': britain,
  'ru': russia,
  'fr': france,
  'de': germany,
  'it': italy,
  'pt': portugal,
  'es': spain,
  'br': brazil,
  'ar': argentina,
  'in': india
}

export const Lang = ({ isActive }) => {
  const { lang, updateLang } = useContext(LangContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  }

  const handleOpenList = (e) => {
    const lang = e.target.dataset.lang;
    setOpen(!open);
    updateLang(lang);
  }

  return (
    <div className={ isActive ? "site-main" : "site-main_active" }>
      <img
        src={ languages[lang] }
        className={ open ? 'lang-icon-preview hidden' : 'lang-icon-preview' }
        alt=""
        onClick={ handleOpen }
      />
      <ul className={ open ? 'lang-list' : 'lang-list hidden' } onClick={ handleOpenList }>
        { Object.entries(languages).map((language) => {
          return (<li>
            <img
              src={ language[1] }
              className={
                isActive ? "lang-icon" : "lang-icon_active"
              }
              data-lang={ language[0] }
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
