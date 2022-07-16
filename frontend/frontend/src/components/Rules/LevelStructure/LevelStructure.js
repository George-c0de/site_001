import Logo from "../../../assets/logo.png"
import style from './LevelStructure.module.css'
import Pokeballs from '../../../assets/fr49-illustration.png'
import {t} from "ttag";

const Fr49 = () => {
    let title = t`Structure of each level`
    let description = t`In Tokemon Game, each card is a separate structure. All new players are randomly placed in a  single large structure on each card, giving  everyone an equal chance to earn rewards  without having to invite personal partners Everyone chooses any card. By  activating a card, a participant  automatically gets into a line with  available seats. Free seats are allocated  and assigned randomly. A new player always takes the right seat in  the cycle of another random participant When both seats in the cycle are occupied  by players, you move to a new row below -  this is a recycle. Then, this action is  repeated as the activity moves on the  level Each participant can take only one seat  (their own cycle) on the line, after closing  their cycle, the participant moves to the  following lines below`
    return (
        <div className={style["wrapper"]}>
            <div className={style["top"]}>
                <img src={Logo} alt="#" className={style["logo"]}/>
                <div className={`${style["title"]} ${style.fade}`}>
                    {title}
                </div>
            </div>
            <img src={Pokeballs} className={style.fade} style={{["--delay"]: 1500 + "ms"}} alt=""/>
            <div>
                <div className={`${style["text"]} ${style.fade}`}>
                    {description}
                </div>
                <div className={style["link"]}>
                    <a href="#">t`still have questions? With full instructions on the game, how to deposit, how to withdraw the winnings, you can read here tokemons.info/Eng`</a>
                </div>
            </div>
        </div>
    )
}

export default Fr49;