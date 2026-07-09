import { Head } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AppLayout from '~/layouts/AppLayout'
import StyledButton from '~/components/StyledButton'
import LoadingSpinner from '~/components/LoadingSpinner'
import { IconMovie, IconDownload, IconPlayerPlay } from '@tabler/icons-react'
import api from '~/lib/api'

export default function TextToVideoPage() {
  const [text, setText] = useState('')
  const [isRendering, setIsRendering] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleRender = async () => {
    if (!text.trim()) return
    setIsRendering(true)
    setVideoUrl(null)
    setError(null)

    const result = await api.renderTextToVideo(text.trim())

    setIsRendering(false)

    if (result?.success && result.videoUrl) {
      setVideoUrl(result.videoUrl)
      setTimeout(() => videoRef.current?.play(), 100)
    } else {
      setError(result?.message || 'Render failed. Please try again.')
    }
  }

  const charCount = text.length
  const isOverLimit = charCount > 2000

  return (
    <AppLayout>
      <Head title="Text to Video" />
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-3">
          <IconMovie size={32} className="text-desert-green" />
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Text to Video</h2>
            <p className="text-text-secondary text-sm">
              Paste or type text below and render it as a 1080p video.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary" htmlFor="video-text">
            Your Text
          </label>
          <textarea
            id="video-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here..."
            rows={8}
            disabled={isRendering}
            className="w-full rounded-md border border-border bg-surface text-text-primary placeholder-text-muted px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-desert-green disabled:opacity-50"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-text-muted'}`}>
              {charCount} / 2000
            </span>
          </div>
        </div>

        <StyledButton
          variant="primary"
          icon="IconPlayerPlay"
          onClick={handleRender}
          loading={isRendering}
          disabled={!text.trim() || isOverLimit || isRendering}
          size="md"
        >
          {isRendering ? 'Rendering...' : 'Render Video'}
        </StyledButton>

        {isRendering && (
          <div className="flex flex-col items-center gap-4 py-8">
            <LoadingSpinner fullscreen={false} text="Rendering your video — this may take up to 30 seconds..." />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {videoUrl && !isRendering && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <IconPlayerPlay size={20} className="text-desert-green" />
              Your Video
            </h3>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-lg border border-border"
            />
            <a
              href={videoUrl}
              download
              className="inline-flex items-center gap-2 text-sm text-desert-green hover:underline"
            >
              <IconDownload size={16} />
              Download MP4
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
