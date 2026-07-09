import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { TextToVideoService } from '#services/text_to_video_service'
import { textToVideoValidator } from '#validators/text_to_video'

@inject()
export default class TextToVideoController {
  constructor(private textToVideoService: TextToVideoService) {}

  async index({ inertia }: HttpContext) {
    return inertia.render('text-to-video')
  }

  async render({ request, response }: HttpContext) {
    const { text } = await request.validateUsing(textToVideoValidator)
    try {
      const result = await this.textToVideoService.render(text)
      return response.json({ success: true, videoUrl: result.videoUrl })
    } catch (error) {
      return response.status(500).json({ success: false, message: error.message })
    }
  }
}
