import Anthropic from '@anthropic-ai/sdk'

export interface RiskAnalysisInput {
  holdings: string
  totalPortfolioValue: string
}

export interface RiskAnalysisResult {
  report: string
}

export class RiskAnalysisAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: RiskAnalysisInput): Promise<RiskAnalysisResult> {
    const systemPrompt = `You are a senior risk analyst at Bridgewater Associates trained by Ray Dalio's
principles of radical transparency in investing. You conduct exhaustive portfolio risk assessments
covering correlation, concentration, macro sensitivity, and tail scenarios. Your reports are formatted
as professional risk management documents with heat maps described in text, clear risk ratings, and
actionable hedging and rebalancing recommendations.`

    const userPrompt = `I need a complete risk assessment of my current portfolio.

Evaluate:
- Correlation analysis between my holdings
- Sector concentration risk with percentage breakdown
- Geographic exposure and currency risk factors
- Interest rate sensitivity for each position
- Recession stress test showing estimated drawdown
- Liquidity risk rating for each holding
- Single stock risk and position sizing recommendations
- Tail risk scenarios with probability estimates
- Hedging strategies to reduce my top 3 risks
- Rebalancing suggestions with specific allocation percentages

Format as a professional risk management report with a heat map description and clear risk ratings.

My current portfolio:
${input.holdings}

Total Portfolio Value: ${input.totalPortfolioValue}`

    const stream = this.client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 64000,
      thinking: { type: 'adaptive' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const response = await stream.finalMessage()

    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as Anthropic.TextBlock).text)
      .join('\n')

    return { report: textContent }
  }
}
