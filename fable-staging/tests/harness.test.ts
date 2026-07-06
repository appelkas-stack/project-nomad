import test from 'node:test'
import assert from 'node:assert/strict'
import { loadQuestionSet, runEval } from '../eval/src/runner.js'
import { getAdapter } from '../eval/src/adapters/index.js'
import { sentenceGrounded } from '../eval/src/scorers/grounding.js'

const QUESTIONS = new URL('../eval/questions/sample.yaml', import.meta.url).pathname

test('end-to-end: sample set + stub adapter produces a scored report', async () => {
  const set = await loadQuestionSet(QUESTIONS)
  const report = await runEval(set, getAdapter('stub'))

  assert.equal(report.adapter, 'stub')
  assert.equal(report.metrics.questionCount, 8)
  assert.equal(report.results.length, 8)
  assert.ok(report.startedAt <= report.finishedAt)

  // Designed failures: 4-bad-refusal and 5-bad-hallucination -> 6/8 correct.
  assert.equal(report.metrics.refusalCorrectness, 6 / 8)

  // Answered answerable: 001, 002, 006 (wrong citation), 007 (ungrounded), 008.
  // Citation hits: all but 006 -> 4/5 (007 cites correctly; only its text is
  // ungrounded). Grounding: only 007 fails.
  assert.equal(report.metrics.citationHitRate, 4 / 5)
  assert.ok(report.metrics.groundedRate > 0.5 && report.metrics.groundedRate < 1)

  assert.ok(report.metrics.p50LatencyMs > 0)
  assert.ok(report.metrics.p95LatencyMs >= report.metrics.p50LatencyMs)
})

test('well-behaved subset scores perfectly', async () => {
  const set = await loadQuestionSet(QUESTIONS)
  set.questions = set.questions.filter((q) => !q.id.includes('-bad-'))
  const report = await runEval(set, getAdapter('stub'))

  assert.equal(report.metrics.refusalCorrectness, 1)
  assert.equal(report.metrics.citationHitRate, 1)
  assert.equal(report.metrics.citationPrecision, 1)
  assert.equal(report.metrics.groundedRate, 1)
})

test('question-set validation rejects answerable questions without sources', async () => {
  await assert.rejects(
    loadQuestionSet(new URL('./fixtures/invalid.yaml', import.meta.url).pathname),
    /expectedSources/
  )
})

test('sentence grounding heuristic behaves', () => {
  const snippet = new Set(['water', 'boiling', 'point', 'celsius', 'degrees'])
  assert.equal(sentenceGrounded('Water has a boiling point of 100 degrees Celsius.', snippet), true)
  assert.equal(sentenceGrounded('Elephants enjoy trampolines every Tuesday afternoon.', snippet), false)
})
