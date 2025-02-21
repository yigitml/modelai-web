import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Acceptable Use Policy | TakeAIPhotos',
  description: 'Acceptable use policy for TakeAIPhotos users.',
}

export default function AcceptableUsePolicy() {
  const acceptableUseHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/acceptable-use/acceptable-use.html')
  const acceptableUseContent = fs.readFileSync(acceptableUseHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: acceptableUseContent }} 
      />
    </div>
  )
}
