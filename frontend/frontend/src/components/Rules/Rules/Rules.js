import Logo from "../../../assets/logo.png"
import Pokeboll from "../../../assets/pokeboll.svg"
import style from './Rules.module.css'

const Fr45 = () => {
    let title = "description"
    let description = "Tokemon Game is a financial game on Tron Chain network, which allows both passive and active players to make money. To receive winnings, players need to buy a card with a Tokemon that will participate in the battle."
    let rulesTitle = "game rules"
    let rules = [
        "The registration is free",
        "To start playing and earning, you need top up your balance in USDT TRC-20 and buy access to your cards",
        "You can take part in all cards at the same time.",
        "Pokemon participate in 4 battles. For each battle you get 40% of the cost of the card.",
        "After receiving 4 wins, you can feed the Tokémon to continue the battles",
        "To receive winnings, you must add a USDT wallet address in the TRC20 network to your account. ATTENTION! Withdrawal address cannot be changed!",
        "Balance replenishment and withdrawal – instant."
    ]
    return (
        <div className={style["wrapper"]}>
            <div className={style["image-box"]}>
                <img src={Logo} alt="" />
                <img src={Pokeboll} alt="" className={`${style["pokeboll"]} ${style["fade"]}`} style={{["--delay"]: 1500 + "ms"}}/>
            </div>
            <div className={style["content"]}>
                <div className={style["column"]}>
                    <div className={`${style["title"]} ${style["fade"]}`}>{title}</div>
                    <div className={`${style["description"]} ${style["fade"]}`} style={{["--delay"]: 1000 + "ms"}}>{description}</div>
                </div>
                <fieldset className={style["game-rules"]}>
                    <legend className={`${style["fade"]} ${style["title"]}`} style={{fontSize: 59 + "px",}} >{rulesTitle}</legend>
                    <div className={style["rules"]}>
                        {rules.map((rule, i) => <div className={`${style["fade"]}`} style={{["--delay"]: 1000 + i * 100 + "ms"}}>-{rule}</div>)}
                    </div>
                </fieldset>
            </div>
        </div>

    )
}

export default Fr45;