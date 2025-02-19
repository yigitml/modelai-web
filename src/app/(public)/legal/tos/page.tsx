import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Terms of Service | ModelAI',
  description: 'Terms of service for ModelAI users.',
}

export default function TermsOfService() {
  const tosHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/tos/tos.html')
  const tosContent = fs.readFileSync(tosHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: tosContent }} 
      />
    </div>
  )
}
