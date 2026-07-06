import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'
import type {
  Adapter,
  AdapterAnswer,
  Question,
  QuestionSet,
  Report,
  ReportMetrics,
  ScoredAnswer,
  Scorer,
} from './types.js'
import { refusalScorer } from './scorers/refusal.js'
import { citationScorer } from './scorers/citation.js'
import { groundingScorer } from './scorers/grounding.js'

export const defaultScorers: Scorer[] = [refusalScorer, citationScorer, groundingScorer]

export async function loadQuestionSet(path: string): Promise<QuestionSet> {
  const raw = parse(await readFile(path, 'utf8')) as QuestionSet
  if (!raw?.name || !raw?.corpus || !Array.isArray(raw?.questions)) {
    throw new Error(`invalid question set at ${path}: expected {name, corpus, questions[]}`)
  }
  for (const q of raw.questions) {
    if (!q.id || !q.text || typeof q.answerable !== 'boolean') {
      throw new Error(`invalid question in ${path}: ${JSON.stringify(q)}`)
    }
    if (q.answerable && (!q.expectedSources || q.expectedSources.length === 0)) {
      throw new Error(`answerable question ${q.id} must declare expectedSources`)
    }
  }
  return raw
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)
  return sorted[Math.max(0, idx)]!
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length
}

export function aggregate(results: ScoredAnswer[]): ReportMetrics {
  const score = (r: ScoredAnswer, name: string) => r.scores.find((s) => s.name === name)?.value
  const answeredAnswerable = results.filter((r) => r.question.answerable && !r.answer.refused)
  const latencies = results.map((r) => r.answer.latencyMs).sort((a, b) => a - b)
  const citationScores = answeredAnswerable
    .map((r) => score(r, 'citation'))
    .filter((v): v is number => v !== undefined)
  return {
    groundedRate: mean(
      answeredAnswerable.map((r) => score(r, 'grounding')).filter((v): v is number => v !== undefined)
    ),
    refusalCorrectness: mean(
      results.map((r) => score(r, 'refusal')).filter((v): v is number => v !== undefined)
    ),
    citationHitRate: citationScores.length === 0 ? 0 : citationScores.filter((v) => v > 0).length / citationScores.length,
    citationPrecision: mean(citationScores.map((v) => (v > 0 ? (v - 0.5) * 2 : 0))),
    p50LatencyMs: percentile(latencies, 50),
    p95LatencyMs: percentile(latencies, 95),
    questionCount: results.length,
    answeredCount: results.filter((r) => !r.answer.refused).length,
    refusedCount: results.filter((r) => r.answer.refused).length,
  }
}

export async function runEval(
  questionSet: QuestionSet,
  adapter: Adapter,
  scorers: Scorer[] = defaultScorers
): Promise<Report> {
  const startedAt = new Date().toISOString()
  const results: ScoredAnswer[] = []
  for (const question of questionSet.questions) {
    const answer = await askTimed(adapter, question)
    const scores = []
    for (const scorer of scorers) {
      const detail = await scorer.score(question, answer)
      if (detail) scores.push(detail)
    }
    results.push({ question, answer, scores })
  }
  return {
    adapter: adapter.name,
    questionSet: questionSet.name,
    corpus: questionSet.corpus,
    startedAt,
    finishedAt: new Date().toISOString(),
    metrics: aggregate(results),
    results,
  }
}

/** Adapters report their own latency; fall back to wall-clock if they don't. */
async function askTimed(adapter: Adapter, question: Question): Promise<AdapterAnswer> {
  const t0 = performance.now()
  const answer = await adapter.ask(question)
  const elapsed = Math.round(performance.now() - t0)
  return { ...answer, latencyMs: answer.latencyMs > 0 ? answer.latencyMs : elapsed }
}
