import Anthropic from '@anthropic-ai/sdk'

export interface PortfolioConstructionInput {
  age: string
  income: string
  savings: string
  goals: string
  riskTolerance: string
  accountType: string
}

export interface PortfolioConstructionResult {
  document: string
}

export class PortfolioConstructionAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: PortfolioConstructionInput): Promise<PortfolioConstructionResult> {
    const systemPrompt = `You are a senior portfolio strategist at BlackRock managing multi-asset
portfolios worth $500M+ for institutional clients. You build custom investment portfolios grounded in
Modern Portfolio Theory, factor investing, and tax efficiency. Your output is formatted as a
professional investment policy document with a clear allocation pie chart description, specific ETF
recommendations with ticker symbols, and a one-page investment policy statement the client can follow.`

    const userPrompt = `I need a custom investment portfolio built from scratch for my situation.

Create:
- Exact asset allocation with percentages across stocks, bonds, alternatives
- Specific ETF or fund recommendations for each category with ticker symbols
- Core holdings vs satellite positions clearly labeled
- Expected annual return range based on historical data
- Expected maximum drawdown in a bad year
- Rebalancing schedule and trigger rules
- Tax efficiency strategy for my account type
- Dollar cost averaging plan if I invest monthly
- Benchmark to measure my performance against
- One-page investment policy statement I can follow

Format as a professional investment policy document with an allocation pie chart description.

My details:
- Age: ${input.age}
- Income: ${input.income}
- Savings: ${input.savings}
- Goals: ${input.goals}
- Risk Tolerance: ${input.riskTolerance}
- Account Type: ${input.accountType}`

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

    return { document: textContent }
  }
}
