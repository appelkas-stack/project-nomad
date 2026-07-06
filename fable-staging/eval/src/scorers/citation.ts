import type { AdapterAnswer, Question, Scorer } from '../types.js'

/**
 * Citation accuracy for answered answerable questions:
 * - hit: at least one cited source is among the expected sources
 * - precision: fraction of cited sources that are expected
 * Score = hit ? (0.5 + 0.5 * precision) : 0, so citing the right page matters
 * most and padding with wrong pages is penalized.
 * Not applicable (null) to refusals and unanswerable questions.
 */
export const citationScorer: Scorer = {
  name: 'citation',
  async score(question: Question, answer: AdapterAnswer) {
    if (!question.answerable || answer.refused) return null
    const expected = new Set(question.expectedSources ?? [])
    if (expected.size === 0) {
      return { name: 'citation', value: 0, notes: 'question has no expectedSources; cannot verify' }
    }
    if (answer.citations.length === 0) {
      return { name: 'citation', value: 0, notes: 'no citations on an answered question' }
    }
    const cited = answer.citations.map((c) => c.sourceId)
    const matched = cited.filter((id) => expected.has(id))
    const hit = matched.length > 0
    const precision = matched.length / cited.length
    return {
      name: 'citation',
      value: hit ? 0.5 + 0.5 * precision : 0,
      notes: hit ? undefined : 'no cited source matches an expected source',
    }
  },
}
