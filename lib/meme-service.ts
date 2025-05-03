"use server"

import { cookies } from "next/headers"
import type { MemeTemplate, GeneratedMeme, MemeGenerationParams, ApiCredentials } from "./types"

// Default credentials
const DEFAULT_CREDENTIALS: ApiCredentials = {
  username: "olalekancodes",
  password: "Rokeeb.6127#",
}

// Cookie name for storing credentials
const CREDENTIALS_COOKIE = "imgflip_credentials"

// Get current API credentials
async function getApiCredentials(): Promise<ApiCredentials> {
  const cookieStore = cookies()
  const credentialsCookie = cookieStore.get(CREDENTIALS_COOKIE)

  if (credentialsCookie) {
    try {
      return JSON.parse(decodeURIComponent(credentialsCookie.value)) as ApiCredentials
    } catch (error) {
      console.error("Error parsing credentials cookie:", error)
    }
  }

  return DEFAULT_CREDENTIALS
}

// Update API credentials
export async function updateApiCredentials(username: string, password: string): Promise<void> {
  const cookieStore = cookies()
  const credentials: ApiCredentials = { username, password }

  // Store credentials in a cookie (expires in 30 days)
  cookieStore.set({
    name: CREDENTIALS_COOKIE,
    value: encodeURIComponent(JSON.stringify(credentials)),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

// Fetch meme templates from Imgflip API
export async function getMemeTemplates(): Promise<MemeTemplate[]> {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes")
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error_message || "Failed to fetch meme templates")
    }

    return data.data.memes
  } catch (error) {
    console.error("Error fetching meme templates:", error)
    throw new Error("Failed to fetch meme templates")
  }
}

// Generate a meme using Imgflip API
export async function generateMeme(params: MemeGenerationParams): Promise<GeneratedMeme> {
  try {
    const credentials = await getApiCredentials()

    const formData = new FormData()
    formData.append("template_id", params.template_id)
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    // Add text lines
    params.text_lines.forEach((text, index) => {
      formData.append(`text${index}`, text)
    })

    const response = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error_message || "Failed to generate meme")
    }

    return {
      url: data.data.url,
      page_url: data.data.page_url,
    }
  } catch (error) {
    console.error("Error generating meme:", error)
    throw new Error("Failed to generate meme")
  }
}
