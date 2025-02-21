import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Return Policy | TakeAIPhotos',
  description: 'Return policy for TakeAIPhotos users.',
}

export default function ReturnPolicy() {
  const returnHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/return/return.html')
  const returnContent = fs.readFileSync(returnHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: returnContent }} 
      />
    </div>
  )
}
