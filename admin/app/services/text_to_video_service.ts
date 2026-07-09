import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { ensureDirectoryExists } from '../utils/fs.js'

const REMOTION_ROOT = join(import.meta.dirname, '..', '..', '..')
const VIDEO_OUTPUT_DIR = join(import.meta.dirname, '..', '..', 'public', 'videos')
const REMOTION_BIN = join(REMOTION_ROOT, 'node_modules', '.bin', 'remotion')
const REMOTION_ENTRY = join(REMOTION_ROOT, 'src', 'index.ts')
const RENDER_TIMEOUT_MS = 120_000

@inject()
export class TextToVideoService {
  async render(text: string): Promise<{ videoUrl: string; filename: string }> {
    await ensureDirectoryExists(VIDEO_OUTPUT_DIR)

    const filename = `${randomUUID()}.mp4`
    const outputPath = join(VIDEO_OUTPUT_DIR, filename)
    const props = JSON.stringify({ text })

    await this._spawnRender([
      'render',
      REMOTION_ENTRY,
      'MyComp',
      '--props',
      props,
      outputPath,
    ])

    return { videoUrl: `/videos/${filename}`, filename }
  }

  private _spawnRender(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      logger.info(`[TextToVideoService] Spawning render: ${args.join(' ')}`)

      const child = spawn(REMOTION_BIN, args, {
        cwd: REMOTION_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      const timer = setTimeout(() => {
        child.kill('SIGTERM')
        reject(new Error('Remotion render timed out after 2 minutes'))
      }, RENDER_TIMEOUT_MS)

      let stderr = ''
      child.stderr?.on('data', (chunk: Buffer) => {
        stderr += chunk.toString()
      })

      child.on('close', (code) => {
        clearTimeout(timer)
        if (code === 0) {
          resolve()
        } else {
          logger.error(`[TextToVideoService] Render failed (exit ${code}): ${stderr}`)
          reject(new Error(`Remotion render exited with code ${code}`))
        }
      })

      child.on('error', (err) => {
        clearTimeout(timer)
        reject(err)
      })
    })
  }
}
