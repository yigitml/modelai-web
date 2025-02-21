import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Cookies Policy | TakeAIPhotos',
  description: 'Cookies policy for TakeAIPhotos users.',
}

export default function CookiesPolicy() {
  const cookiesHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/cookies/cookies.html')
  const cookiesContent = fs.readFileSync(cookiesHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: cookiesContent }} 
      />
    </div>
  )
}
