import Anthropic from '@anthropic-ai/sdk'

export interface DcfValuationInput {
  tickerSymbol: string
  companyName: string
}

export interface DcfValuationResult {
  memo: string
}

export class DcfValuationAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: DcfValuationInput): Promise<DcfValuationResult> {
    const systemPrompt = `You are a VP-level investment banker at Morgan Stanley who builds valuation
models for Fortune 500 M&A deals. You produce rigorous discounted cash flow analyses with clear
assumptions, sensitivity tables, and investment verdicts. Your memos are formatted professionally
with tables and explicit math showing every calculation step.`

    const userPrompt = `I need a full discounted cash flow analysis for the following stock.

Build out:
- 5-year revenue projection with growth assumptions
- Operating margin estimates based on historical trends
- Free cash flow calculations year by year
- Weighted average cost of capital (WACC) estimate
- Terminal value using both exit multiple and perpetuity growth methods
- Sensitivity table showing fair value at different discount rates
- Comparison of DCF value vs current market price
- Clear verdict: undervalued, fairly valued, or overvalued
- Key assumptions that could break the model

Format as an investment banking valuation memo with tables and clear math.

The stock I want valued:
- Ticker Symbol: ${input.tickerSymbol}
- Company Name: ${input.companyName}`

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
