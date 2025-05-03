import MemeCreator from "@/components/meme-creator"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Meme Creator</h1>
          <p className="text-gray-600 dark:text-gray-300">Create and share your favorite memes!</p>
        </header>

        <MemeCreator />
        <Toaster />
      </div>
    </main>
  )
}
