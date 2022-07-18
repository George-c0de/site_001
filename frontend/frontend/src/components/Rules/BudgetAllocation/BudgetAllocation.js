import Logo from "../../../assets/logo.png"
import SideImage from "../../../assets/fr48-side-image.png"
import style from './BudgetAllocation.module.css'
import {t} from "ttag";

const Fr48 = () => {
    let title = t`BUDGET ALLOCATION`
    let labels = [t`Battle payment`, t`Advertising expenses`, t`Affiliate rewards`]
    return (
        <div className={style["wrapper"]}>
            <div className={style["top"]}>
                <img src={Logo} alt="#" className={style["logo"]} />
                <div className={style["title"]}>
                    {title}
                </div>
            </div>
            <div className={style["diagram"]}>
                <div className={`${style["bar-label"]} ${style["bar-label-1"]} ${style.fade}`} style={{["--delay"]: 500 + "ms"}}>{labels[0]}</div>
                <div className={`${style["bar-label"]} ${style["bar-label-2"]} ${style.fade}`} style={{["--delay"]: 1000 + "ms"}}>{labels[1]}</div>
                <div className={`${style["bar-label"]} ${style["bar-label-3"]} ${style.fade}`} style={{["--delay"]: 1500 + "ms"}}>{labels[2]}</div>
                <div className={`${style["progressbar"]} ${style.fade}`} style={{["--delay"]: 200 + "ms"}}>
                    <div className={style["bar-1"]}>80%</div>
                    <div className={style["bar-2"]}>5%</div>
                    <div className={style["bar-3"]}>15%</div>
                </div>
            </div>
            <img className={`${style["side-image"]} ${style["fade"]}`} style={{["--delay"]: 2000 + "ms"}} src={SideImage} />
        </div>
    )
}

export default Fr48;