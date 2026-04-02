import Anthropic from '@anthropic-ai/sdk'

export interface MacroImpactInput {
  currentHoldings: string
  biggestEconomicConcern: string
}

export interface MacroImpactResult {
  briefing: string
}

export class MacroImpactAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: MacroImpactInput): Promise<MacroImpactResult> {
    const systemPrompt = `You are a senior partner at McKinsey's Global Institute who advises
sovereign wealth funds on how macroeconomic trends affect equity markets. You produce executive
macro strategy briefings with a clear action plan, covering interest rates, inflation, GDP,
currency, employment, Fed policy, geopolitics, and sector rotation with specific portfolio
adjustment recommendations.`

    const userPrompt = `I need a macro analysis showing how current economic conditions affect my portfolio.

Analyze:
- Current interest rate environment and its impact on growth vs value stocks
- Inflation trend analysis and which sectors benefit or suffer
- GDP growth forecast and what it means for corporate earnings
- US dollar strength impact on international vs domestic holdings
- Employment data trends and consumer spending implications
- Federal Reserve policy outlook for the next 6-12 months
- Global risk factors (geopolitics, trade wars, supply chains)
- Sector rotation recommendation based on current economic cycle
- Specific portfolio adjustments I should consider right now
- Timeline: when these macro factors will most likely impact markets

Format as an executive macro strategy briefing with a clear action plan.

My current holdings: ${input.currentHoldings}

My biggest concern about the economy: ${input.biggestEconomicConcern}`

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

    return { briefing: textContent }
  }
}
