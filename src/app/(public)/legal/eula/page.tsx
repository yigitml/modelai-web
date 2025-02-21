import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'EULA | TakeAIPhotos',
  description: 'End User License Agreement for TakeAIPhotos users.',
}

export default function EULA() {
  const eulaHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/eula/eula.html')
  const eulaContent = fs.readFileSync(eulaHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: eulaContent }} 
      />
    </div>
  )
}
