import type { Adapter } from '../types.js'
import { stubAdapter } from './stub.js'

/**
 * Adapter registry. Incumbent adapters (open-webui, anythingllm, lm-studio,
 * nomad) and the fable prototype land here in tasks 0.4–0.5.
 */
const adapters: Record<string, Adapter> = {
  stub: stubAdapter,
}

export function getAdapter(name: string): Adapter {
  const adapter = adapters[name]
  if (!adapter) {
    throw new Error(`unknown adapter "${name}" (available: ${Object.keys(adapters).join(', ')})`)
  }
  return adapter
}
