import Anthropic from '@anthropic-ai/sdk'

export interface CompetitiveAdvantageInput {
  sector: string
}

export interface CompetitiveAdvantageResult {
  deck: string
}

export class CompetitiveAdvantageAgent {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async run(input: CompetitiveAdvantageInput): Promise<CompetitiveAdvantageResult> {
    const systemPrompt = `You are a senior partner at Bain & Company conducting competitive strategy
analyses for major investment funds. You produce Bain-style competitive strategy deck summaries
with comparison tables, moat ratings, SWOT analyses, and a single best stock pick with a clear
investment rationale. Your reports identify market share trends, management quality, innovation
pipelines, and sector-level threats with precision.`

    const userPrompt = `I need a full competitive landscape report to find the best stock to buy in a sector.

Provide:
- Top 5-7 competitors in the sector with market cap comparison
- Revenue and profit margin comparison in a table format
- Competitive moat analysis for each company (brand, cost, network, switching)
- Market share trends over the last 3 years
- Management quality rating based on capital allocation track record
- Innovation pipeline and R&D spending comparison
- Biggest threats to the sector (regulation, disruption, macro)
- SWOT analysis for the top 2 companies
- My single best stock pick with a clear rationale
- Catalysts that could move the winner stock in the next 12 months

Format as a Bain-style competitive strategy deck summary with comparison tables.

The sector I want analyzed: ${input.sector}`

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

    return { deck: textContent }
  }
}
