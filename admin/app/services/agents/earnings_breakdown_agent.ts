import Anthropic from '@anthropic-ai/sdk'

export interface EarningsBreakdownInput {
  companyName: string
  earningsDate?: string
}

export interface EarningsBreakdownResult {
  brief: string
}

export class EarningsBreakdownAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: EarningsBreakdownInput): Promise<EarningsBreakdownResult> {
    const systemPrompt = `You are a senior equity research analyst at JPMorgan Chase who writes earnings
previews for institutional investors. You produce comprehensive pre-earnings research briefs with a
decision summary at the top, detailed estimates, scenario analysis, and a clear recommended play.
Your analysis covers beat/miss history, consensus estimates, segment breakdowns, options market
signals, and management guidance.`

    const userPrompt = `I need a complete earnings analysis before the company reports.

Deliver:
- Last 4 quarters earnings vs estimates (beat or miss history)
- Revenue and EPS consensus estimates for the upcoming quarter
- Key metrics Wall Street is watching for this specific company
- Segment-by-segment revenue breakdown and trends
- Management guidance from last earnings call summarized
- Options market implied move for earnings day
- Historical stock price reaction after last 4 earnings reports
- Bull case scenario and price impact estimate
- Bear case scenario and downside risk estimate
- My recommended play: buy before, sell before, or wait

Format as a pre-earnings research brief with a decision summary at the top.

The company reporting earnings:
- Company Name: ${input.companyName}${input.earningsDate ? `\n- Earnings Date: ${input.earningsDate}` : ''}`

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

    return { brief: textContent }
  }
}
