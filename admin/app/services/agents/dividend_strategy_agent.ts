import Anthropic from '@anthropic-ai/sdk'

export interface DividendStrategyInput {
  totalInvestmentAmount: string
  monthlyIncomeGoal: string
  accountType: string
  taxBracket: string
}

export interface DividendStrategyResult {
  blueprint: string
}

export class DividendStrategyAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: DividendStrategyInput): Promise<DividendStrategyResult> {
    const systemPrompt = `You are the chief investment strategist for Harvard's $50B endowment fund
specializing in income-generating equity strategies. You build dividend income portfolios with
rigorous safety analysis, DRIP compounding projections, and tax efficiency planning. Your output
is formatted as a dividend portfolio blueprint with a clear income projection table ranked from
safest to most aggressive picks.`

    const userPrompt = `I need a dividend income portfolio that generates reliable passive income.

Build:
- 15-20 dividend stock picks with ticker symbols and current yield
- Dividend safety score for each stock (1-10 scale)
- Consecutive years of dividend growth for each pick
- Payout ratio analysis to flag any unsustainable dividends
- Monthly income projection based on my investment amount
- Sector diversification breakdown to avoid concentration
- Dividend growth rate estimate for the next 5 years
- DRIP reinvestment projection showing compounding over 10 years
- Tax implications summary for dividends in my account type
- Ranked list from safest to most aggressive picks

Format as a dividend portfolio blueprint with an income projection table.

My situation:
- Total Investment Amount: ${input.totalInvestmentAmount}
- Monthly Income Goal: ${input.monthlyIncomeGoal}
- Account Type: ${input.accountType}
- Tax Bracket: ${input.taxBracket}`

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

    return { blueprint: textContent }
  }
}
