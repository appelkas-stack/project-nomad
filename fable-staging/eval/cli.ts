import { parseArgs } from 'node:util'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { loadQuestionSet, runEval } from './src/runner.js'
import { getAdapter } from './src/adapters/index.js'
import type { Report } from './src/types.js'

const { values } = parseArgs({
  options: {
    questions: { type: 'string', short: 'q' },
    adapter: { type: 'string', short: 'a', default: 'stub' },
    out: { type: 'string', short: 'o', default: 'eval/out/report.json' },
  },
})

if (!values.questions) {
  console.error('usage: npm run eval -- --questions eval/questions/sample.yaml [--adapter stub] [--out report.json]')
  process.exit(2)
}

const questionSet = await loadQuestionSet(values.questions)
const adapter = getAdapter(values.adapter!)
const report = await runEval(questionSet, adapter)

await mkdir(dirname(values.out!), { recursive: true })
await writeFile(values.out!, JSON.stringify(report, null, 2))
console.log(summarize(report))
console.log(`\nfull report: ${values.out}`)

function summarize(r: Report): string {
  const m = r.metrics
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`
  return [
    `adapter: ${r.adapter} · set: ${r.questionSet} (${m.questionCount} questions, ${m.answeredCount} answered / ${m.refusedCount} refused)`,
    `grounded rate:        ${pct(m.groundedRate)}   (baseline lexical scorer — see eval/src/scorers/grounding.ts)`,
    `refusal correctness:  ${pct(m.refusalCorrectness)}`,
    `citation hit rate:    ${pct(m.citationHitRate)}   precision: ${pct(m.citationPrecision)}`,
    `latency p50/p95:      ${m.p50LatencyMs}ms / ${m.p95LatencyMs}ms`,
  ].join('\n')
}
