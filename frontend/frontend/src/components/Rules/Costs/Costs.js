import style from "./Costs.module.css"
import PokebollImg from "../../../assets/pokeboll.svg"
import Logo from "../../../assets/logo.png";

let Col = ({cost, league, content, delay}) => {

	return (
		<div className={`${style.item} ${style[league]} ${style.fade}`} style={{["--delay"]: delay + "ms"}}>
			{cost && cost + "$" || content}
			<img src={PokebollImg} alt="#" />
		</div>
	)
}


let Row = ({cols, delay, num}) => {
	const leagues = ["bronze", "silver", "gold", "emerald"]
	return (
		<div className={style["table-row"]}>
			<div className={style["row-number"]}>{num}</div>
			{cols.map((col, i) => <Col key={i} delay={delay + i * 100} cost={!isNaN(col) && col || null} content={col} league={leagues[i]}/>)}
		</div>
	)
}

const Fr46 = ({rows=[
	[10, 100, 750, 2500],
	[15, 150, 1000, 5000],
	[25, 250, 1250, 7500],
	[40, 400, 1500, 10000],
	[50, 500, 2000, 15000],
	["?", "?", "?", "?"]
]}) => {
	let title = "Cost of cards"
	return (
		<div className={style["wrapper"]}>
			<img src={Logo} alt="" className={style["logo"]} />
			<div className={`${style["title"]} ${style["fade"]}`}>
				{title}
			</div>
			<div className={style["content"]}>
				<div className={style["table"]}>
					{rows.map((row, i) => <Row key={i} cols={row} delay={400 * i} num={i + 1}/>)}
				</div>
				<img src="../assets/boy-img.png" alt="" style={{maxHeight: 550 + "px"}} />
			</div>
		</div>
	)
}

export default Fr46