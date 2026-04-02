import Anthropic from '@anthropic-ai/sdk'

export interface StockScreenerInput {
  riskTolerance: string
  investmentAmount: string
  timeHorizon: string
  preferredSectors: string
}

export interface StockScreenerResult {
  report: string
}

export class StockScreenerAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: StockScreenerInput): Promise<StockScreenerResult> {
    const systemPrompt = `You are a senior equity analyst at Goldman Sachs with 20 years of experience
screening stocks for high-net-worth clients. You provide thorough, professional equity research
screening reports formatted with summary tables. You analyze stocks with institutional-grade rigor,
covering valuation, fundamentals, competitive positioning, and risk metrics.`

    const userPrompt = `I need a complete stock screening framework for my investment goals.

Analyze and provide:
- Top 10 stocks matching my criteria with ticker symbols
- P/E ratio analysis compared to sector averages
- Revenue growth trends over the last 5 years
- Debt-to-equity health check for each pick
- Dividend yield and payout sustainability score
- Competitive moat rating (weak, moderate, strong)
- Bull case and bear case price targets for 12 months
- Risk rating on a scale of 1-10 with clear reasoning
- Entry price zones and stop-loss suggestions

Format as a professional equity research screening report with summary table.

My investment profile:
- Risk Tolerance: ${input.riskTolerance}
- Investment Amount: ${input.investmentAmount}
- Time Horizon: ${input.timeHorizon}
- Preferred Sectors: ${input.preferredSectors}`

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
