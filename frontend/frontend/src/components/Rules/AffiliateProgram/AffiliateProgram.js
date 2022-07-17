import Logo from "../../../assets/logo.png"
import Pokeboll from "../../../assets/pokeboll.svg"
import style from './AffiliateProgram.module.css'
import { t } from 'ttag';

const Fr47 = () => {
    let title =  t`affiliate program`
    let wordsTitle = t`3 lines = 15%`
    let wordsDescription = t`Affiliate reward comes only from active cards. If your card is not active, then the Affiliate reward is not charged`
    let line = t`line`
    return (
        <div className={style["wrapper"]}>
        <img src={Logo} alt="" className={style["logo"]} />
        <div className={style["content"]}>
            <div className={`${style["title"]} ${style["fade"]}`} style={{["--delay"]: 300 + "ms"}}>{title}</div>
            <div className={`${style["pikachu-words"]} ${style["fade"]}`} style={{["--delay"]: 500 + "ms"}}>
                <div className={style["words"]}>
                    <div className={`${style["words-title"]} ${style["fade"]}`} style={{["--delay"]: 1500 + "ms"}}>{wordsTitle}</div>
                    <div className={`${style["words-description"]} ${style["fade"]}`} style={{["--delay"]: 500 + "ms"}}>
                        {wordsDescription}
                    </div>
                </div>
            </div>
            <div className={style["table-box"]}>
                <div className={style["table"]}>
                    <div className={style["table-item"]}>
                        <div> 3 {line} </div>
                        <img src={Pokeboll} alt="" />
                    </div>
                    <div className={`${style["table-item"]} ${style["br-left"]}`}>
                        <div> 2 {line} </div>
                        <img src={Pokeboll} alt="" />
                    </div>
                    <div className={`${style["table-item"]} ${style["br-left"]}`}>
                        <div> 1 {line} </div>
                        <img src={Pokeboll} alt="" />
                    </div>
                    <div className={`${style["table-item"]} ${style["br-top"]}`}>
                        1%
                    </div>
                    <div className={`${style["table-item"]} ${style["br-left"]} ${style["br-top"]}`}>
                        4%
                    </div>
                    <div className={`${style["table-item"]} ${style["br-left"]} ${style["br-top"]}`}>
                        10%
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default Fr47;