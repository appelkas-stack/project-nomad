/**
 * Core types for the Fable eval harness (FABLE_BUILD_PLAN.md task 0.1).
 *
 * The harness measures the four qualities the product thesis stands on:
 * grounding, refusal correctness, citation accuracy, and latency.
 */

export interface Question {
  /** Stable unique id, e.g. "wikimed-001". */
  id: string
  text: string
  /** True if the corpus contains enough information to answer. */
  answerable: boolean
  /** Corpus this question runs against, e.g. "wikimed". */
  corpus: string
  /** medical | encyclopedia | repair | ... */
  category?: string
  /**
   * Source page references (corpus-relative, e.g. ZIM article paths) that a
   * grounded answer must cite. Required when answerable.
   */
  expectedSources?: string[]
  notes?: string
}

export interface QuestionSet {
  name: string
  corpus: string
  questions: Question[]
}

export interface Citation {
  /** Corpus-relative source reference, comparable to Question.expectedSources. */
  sourceId: string
  /** Verbatim snippet the answer claims to be supported by, when available. */
  snippet?: string
}

export interface AdapterAnswer {
  questionId: string
  /** True when the system declined to answer ("not in your library"). */
  refused: boolean
  /** Empty string when refused. */
  text: string
  citations: Citation[]
  latencyMs: number
}

/** A system under test: Fable itself, Open WebUI, AnythingLLM, LM Studio, NOMAD, ... */
export interface Adapter {
  name: string
  ask(question: Question): Promise<AdapterAnswer>
}

export interface ScoreDetail {
  /** Scorer name, e.g. "grounding". */
  name: string
  /** Normalized 0..1. */
  value: number
  notes?: string
}

export interface Scorer {
  name: string
  /**
   * Returns null when the scorer does not apply to this question/answer pair
   * (e.g. grounding is undefined for a correct refusal).
   */
  score(question: Question, answer: AdapterAnswer): Promise<ScoreDetail | null>
}

export interface ScoredAnswer {
  question: Question
  answer: AdapterAnswer
  scores: ScoreDetail[]
}

export interface ReportMetrics {
  /** Mean grounding score over answered answerable questions. */
  groundedRate: number
  /** Fraction of questions with the correct answer/refuse behavior. */
  refusalCorrectness: number
  /** Fraction of answered answerable questions citing >=1 expected source. */
  citationHitRate: number
  /** Mean citation precision (cited sources that are expected) over answered answerable questions. */
  citationPrecision: number
  p50LatencyMs: number
  p95LatencyMs: number
  questionCount: number
  answeredCount: number
  refusedCount: number
}

export interface Report {
  adapter: string
  questionSet: string
  corpus: string
  startedAt: string
  finishedAt: string
  metrics: ReportMetrics
  results: ScoredAnswer[]
}
