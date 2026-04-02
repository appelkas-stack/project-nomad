import Anthropic from '@anthropic-ai/sdk'

export interface TechnicalAnalysisInput {
  tickerSymbol: string
  currentPosition?: string
}

export interface TechnicalAnalysisResult {
  reportCard: string
}

export class TechnicalAnalysisAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: TechnicalAnalysisInput): Promise<TechnicalAnalysisResult> {
    const systemPrompt = `You are a senior quantitative trader at Citadel who combines technical
analysis with statistical models to time entries and exits. You produce technical analysis report
cards with a clear trade plan summary, covering multi-timeframe trends, key levels, momentum
indicators, chart patterns, and precise entry/stop/target levels with risk-to-reward ratios.`

    const userPrompt = `I need a full technical analysis breakdown of a stock.

Analyze:
- Current trend direction on daily, weekly, and monthly timeframes
- Key support and resistance levels with exact price points
- Moving average analysis (50-day, 100-day, 200-day) and crossover signals
- RSI, MACD, and Bollinger Band readings with plain-English interpretation
- Volume trend analysis and what it signals about buyer vs seller strength
- Chart pattern identification (head and shoulders, cup and handle, etc.)
- Fibonacci retracement levels for potential bounce zones
- Ideal entry price, stop-loss level, and profit target
- Risk-to-reward ratio for the current setup
- Confidence rating: strong buy, buy, neutral, sell, strong sell

Format as a technical analysis report card with a clear trade plan summary.

The stock to analyze:
- Ticker Symbol: ${input.tickerSymbol}${input.currentPosition ? `\n- Current Position: ${input.currentPosition}` : ''}`

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

    return { reportCard: textContent }
  }
}
