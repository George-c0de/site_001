import Motion from '../components/Rules/Motion/motion.js'
import Rules from '../components/Rules/Rules/Rules.js';
// import Costs from '../components/Rules/Costs/Costs.js'
import AffiliateProgram from '../components/Rules/AffiliateProgram/AffiliateProgram.js';
import BudgetAllocation from '../components/Rules/BudgetAllocation/BudgetAllocation.js'
import LevelStructure from '../components/Rules/LevelStructure/LevelStructure.js';
import '../index.css'
import {useEffect} from "react";


const RulesPage = () => {
    useEffect(() => {
        setTimeout(() => {
            window.location.assign("/")
        }, 25000)
    })

    return (
        <Motion>
            <Rules />
            {/*<Costs />*/}
            <AffiliateProgram />
            <BudgetAllocation />
            <LevelStructure />
        </Motion>
    )
}

export default RulesPage