import type { AdapterAnswer, Question, Scorer } from '../types.js'

/**
 * Grounding (BASELINE implementation): fraction of answer sentences that have
 * meaningful lexical overlap with the snippets of the answer's own citations.
 *
 * This is a deliberately simple stand-in so the harness runs end-to-end from
 * day one. Task 0.3 replaces/augments it with a judge-based scorer behind the
 * same Scorer interface and calibrates against hand-scored samples (>=85%
 * agreement acceptance criterion). Do not quote baseline grounding numbers as
 * product claims.
 *
 * Not applicable (null) to refusals and unanswerable questions.
 */

const STOPWORDS = new Set(
  'a an the of to in on for and or is are was were be been it its as at by with from that this these those you your'.split(
    ' '
  )
)

function contentTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

/** A sentence is grounded if >=50% of its content tokens appear in cited snippets. */
export function sentenceGrounded(sentence: string, snippetTokens: Set<string>): boolean {
  const tokens = contentTokens(sentence)
  if (tokens.length === 0) return true
  const supported = tokens.filter((t) => snippetTokens.has(t)).length
  return supported / tokens.length >= 0.5
}

export const groundingScorer: Scorer = {
  name: 'grounding',
  async score(question: Question, answer: AdapterAnswer) {
    if (!question.answerable || answer.refused) return null
    const snippetText = answer.citations.map((c) => c.snippet ?? '').join(' ')
    if (snippetText.trim().length === 0) {
      return { name: 'grounding', value: 0, notes: 'no citation snippets to ground against' }
    }
    const snippetTokens = new Set(contentTokens(snippetText))
    const parts = sentences(answer.text)
    if (parts.length === 0) {
      return { name: 'grounding', value: 0, notes: 'empty answer text' }
    }
    const grounded = parts.filter((s) => sentenceGrounded(s, snippetTokens)).length
    return {
      name: 'grounding',
      value: grounded / parts.length,
      notes: grounded === parts.length ? undefined : `${parts.length - grounded}/${parts.length} sentences unsupported`,
    }
  },
}
