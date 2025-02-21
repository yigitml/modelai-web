import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Disclaimer | TakeAIPhotos',
  description: 'Disclaimer for TakeAIPhotos users.',
}

export default function Disclaimer() {
  const disclaimerHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/disclaimer/disclaimer.html')
  const disclaimerContent = fs.readFileSync(disclaimerHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: disclaimerContent }} 
      />
    </div>
  )
}
