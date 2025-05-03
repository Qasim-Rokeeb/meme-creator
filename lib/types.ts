export interface MemeTemplate {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
}

export interface GeneratedMeme {
  url: string
  page_url: string
}

export interface MemeGenerationParams {
  template_id: string
  text_lines: string[]
}

export interface ApiCredentials {
  username: string
  password: string
}
