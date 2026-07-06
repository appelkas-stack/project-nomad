import type { AdapterAnswer, Question, Scorer } from '../types.js'

/**
 * Refusal correctness: answer answerable questions, refuse unanswerable ones.
 * A wrong refusal (refusing an answerable question) and a hallucinated answer
 * (answering an unanswerable question) both score 0.
 */
export const refusalScorer: Scorer = {
  name: 'refusal',
  async score(question: Question, answer: AdapterAnswer) {
    const correct = question.answerable ? !answer.refused : answer.refused
    return {
      name: 'refusal',
      value: correct ? 1 : 0,
      notes: correct
        ? undefined
        : question.answerable
          ? 'refused an answerable question'
          : 'answered a question the corpus cannot support',
    }
  },
}
