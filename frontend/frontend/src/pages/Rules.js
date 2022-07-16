import Motion from '../components/Rules/Motion/motion.js'
import Rules from '../components/Rules/Rules/Rules.js';
import Costs from '../components/Rules/Costs/Costs.js'
import AffiliateProgram from '../components/Rules/AffiliateProgram/AffiliateProgram.js';
import BudgetAllocation from '../components/Rules/BudgetAllocation/BudgetAllocation.js'
import LevelStructure from '../components/Rules/LevelStructure/LevelStructure.js';
import '../index.css'

const RulesPage = () => <Motion>
    <Rules />
    <Costs />
    <AffiliateProgram />
    <BudgetAllocation />
    <LevelStructure />
</Motion>

export default RulesPage