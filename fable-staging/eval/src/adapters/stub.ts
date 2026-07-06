import type { Adapter, Question } from '../types.js'

/**
 * Deterministic stub adapter for exercising the harness itself.
 *
 * Behavior is keyed off the question id so scorer edge cases are covered
 * without randomness:
 *  - ids ending in "-bad-refusal":  refuses an answerable question
 *  - ids ending in "-bad-hallucination": answers an unanswerable question
 *  - ids ending in "-bad-citation": answers with a wrong citation
 *  - ids ending in "-bad-grounding": answers with correct citation but
 *    an answer text unsupported by the snippet
 *  - everything else: well-behaved (grounded answer citing the first
 *    expected source, or a refusal when unanswerable)
 */
export const stubAdapter: Adapter = {
  name: 'stub',
  async ask(question: Question) {
    const base = { questionId: question.id, latencyMs: 5 }

    if (question.id.endsWith('-bad-refusal')) {
      return { ...base, refused: true, text: '', citations: [] }
    }
    if (question.id.endsWith('-bad-hallucination')) {
      return {
        ...base,
        refused: false,
        text: 'Confidently made up answer with no basis in the corpus.',
        citations: [],
      }
    }

    if (!question.answerable) {
      return { ...base, refused: true, text: '', citations: [] }
    }

    const source = question.expectedSources?.[0] ?? 'unknown'
    const snippet = `Reference material for ${question.text} explaining the established procedure and relevant details.`

    if (question.id.endsWith('-bad-citation')) {
      return {
        ...base,
        refused: false,
        text: `Reference material explaining the established procedure and relevant details.`,
        citations: [{ sourceId: 'wrong/source/page', snippet }],
      }
    }
    if (question.id.endsWith('-bad-grounding')) {
      return {
        ...base,
        refused: false,
        text: 'Completely unrelated statement mentioning nothing verifiable whatsoever.',
        citations: [{ sourceId: source, snippet }],
      }
    }
    return {
      ...base,
      refused: false,
      text: `Reference material for ${question.text} explaining the established procedure and relevant details.`,
      citations: [{ sourceId: source, snippet }],
    }
  },
}
