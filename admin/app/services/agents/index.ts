/**
 * Nomad Capital AI — Institutional-Grade Financial Intelligence Suite
 *
 * Ten specialized financial agents modeled after the world's top investment firms,
 * all accessible through a single unified interface.
 */

import { StockScreenerAgent } from './stock_screener_agent.js'
import { DcfValuationAgent } from './dcf_valuation_agent.js'
import { RiskAnalysisAgent } from './risk_analysis_agent.js'
import { EarningsBreakdownAgent } from './earnings_breakdown_agent.js'
import { PortfolioConstructionAgent } from './portfolio_construction_agent.js'
import { TechnicalAnalysisAgent } from './technical_analysis_agent.js'
import { DividendStrategyAgent } from './dividend_strategy_agent.js'
import { CompetitiveAdvantageAgent } from './competitive_advantage_agent.js'
import { PatternFinderAgent } from './pattern_finder_agent.js'
import { MacroImpactAgent } from './macro_impact_agent.js'

export type {
  StockScreenerInput,
  StockScreenerResult,
} from './stock_screener_agent.js'
export type { DcfValuationInput, DcfValuationResult } from './dcf_valuation_agent.js'
export type { RiskAnalysisInput, RiskAnalysisResult } from './risk_analysis_agent.js'
export type {
  EarningsBreakdownInput,
  EarningsBreakdownResult,
} from './earnings_breakdown_agent.js'
export type {
  PortfolioConstructionInput,
  PortfolioConstructionResult,
} from './portfolio_construction_agent.js'
export type {
  TechnicalAnalysisInput,
  TechnicalAnalysisResult,
} from './technical_analysis_agent.js'
export type {
  DividendStrategyInput,
  DividendStrategyResult,
} from './dividend_strategy_agent.js'
export type {
  CompetitiveAdvantageInput,
  CompetitiveAdvantageResult,
} from './competitive_advantage_agent.js'
export type { PatternFinderInput, PatternFinderResult } from './pattern_finder_agent.js'
export type { MacroImpactInput, MacroImpactResult } from './macro_impact_agent.js'

/**
 * NomadCapitalAI — Unified access to all 10 institutional financial agents.
 *
 * Usage:
 *   const ai = new NomadCapitalAI()
 *   const result = await ai.stockScreener.run({ ... })
 *   const dcf    = await ai.dcfValuation.run({ ... })
 */
export class NomadCapitalAI {
  /** Goldman Sachs-style stock screener with P/E, moat ratings, and 12-month price targets */
  readonly stockScreener: StockScreenerAgent

  /** Morgan Stanley-style DCF with FCF projections, WACC, and sensitivity tables */
  readonly dcfValuation: DcfValuationAgent

  /** Bridgewater-style portfolio risk assessment with stress tests and hedging strategies */
  readonly riskAnalysis: RiskAnalysisAgent

  /** JPMorgan-style pre-earnings brief with beat/miss history and recommended play */
  readonly earningsBreakdown: EarningsBreakdownAgent

  /** BlackRock-style portfolio builder with ETF picks and investment policy statement */
  readonly portfolioConstruction: PortfolioConstructionAgent

  /** Citadel-style technical analysis with multi-timeframe trends and trade plan */
  readonly technicalAnalysis: TechnicalAnalysisAgent

  /** Harvard Endowment-style dividend portfolio with DRIP compounding projections */
  readonly dividendStrategy: DividendStrategyAgent

  /** Bain-style competitive landscape with moat analysis and single best stock pick */
  readonly competitiveAdvantage: CompetitiveAdvantageAgent

  /** Renaissance Technologies-style pattern finder for seasonal and statistical edges */
  readonly patternFinder: PatternFinderAgent

  /** McKinsey-style macro impact assessment with sector rotation and portfolio adjustments */
  readonly macroImpact: MacroImpactAgent

  constructor() {
    this.stockScreener = new StockScreenerAgent()
    this.dcfValuation = new DcfValuationAgent()
    this.riskAnalysis = new RiskAnalysisAgent()
    this.earningsBreakdown = new EarningsBreakdownAgent()
    this.portfolioConstruction = new PortfolioConstructionAgent()
    this.technicalAnalysis = new TechnicalAnalysisAgent()
    this.dividendStrategy = new DividendStrategyAgent()
    this.competitiveAdvantage = new CompetitiveAdvantageAgent()
    this.patternFinder = new PatternFinderAgent()
    this.macroImpact = new MacroImpactAgent()
  }
}

/** Default export — instantiate once and reuse across your application */
export default NomadCapitalAI
