import Anthropic from '@anthropic-ai/sdk'

export interface PatternFinderInput {
  tickerSymbol: string
  timePeriod: string
}

export interface PatternFinderResult {
  memo: string
}

export class PatternFinderAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: PatternFinderInput): Promise<PatternFinderResult> {
    const systemPrompt = `You are a quantitative researcher at Renaissance Technologies using
data-driven methods to find statistical edges in the stock market. You identify hidden seasonal
patterns, event-driven anomalies, ownership flows, and options signals that give quantifiable
trading advantages. Your output is formatted as a quantitative research memo with data tables
and pattern summaries.`

    const userPrompt = `I need you to identify hidden patterns and anomalies in a stock's behavior.

Research:
- Seasonal patterns: best and worst months historically
- Day-of-week performance patterns if any exist
- Correlation with major market events (Fed meetings, CPI reports)
- Insider buying and selling patterns from recent filings
- Institutional ownership trend: are big funds buying or selling
- Short interest analysis and squeeze potential
- Unusual options activity signals worth watching
- Price behavior around earnings (pre-run, post-gap patterns)
- Sector rotation signals that affect this stock
- Statistical edge summary: what gives this stock a quantifiable advantage

Format as a quantitative research memo with data tables and pattern summaries.

The stock to investigate:
- Ticker Symbol: ${input.tickerSymbol}
- Time Period: ${input.timePeriod}`

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

    return { memo: textContent }
  }
}
