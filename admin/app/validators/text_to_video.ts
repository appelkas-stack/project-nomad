import vine from '@vinejs/vine'

export const textToVideoValidator = vine.compile(
  vine.object({
    text: vine.string().trim().minLength(1).maxLength(2000),
  })
)
